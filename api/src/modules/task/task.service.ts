import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { FindOptionsWhere, Not, In, IsNull, Repository } from 'typeorm';
import { DeleteTaskArgs, TaskInput } from './dtos/task.input';
import { TaskCategory } from './task-category.entity';
import { TaskType } from './enums/task-type.enum';
import { TaskStatus } from './enums/task-status.enum';
import { TaskRepeat } from './enums/task-repeat.enum';
import { DateTime } from 'luxon';
import { Cron } from '@nestjs/schedule';
import { TaskLinkService } from './task-link.service';
import { TaskFilterArgs } from './dtos/task-filter.args';
import { AssignmentService } from './assignment.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name, { timestamp: true });

  constructor(
    private readonly linkService: TaskLinkService,
    private readonly assignmentService: AssignmentService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskCategory)
    private taskCategoryRepository: Repository<TaskCategory>,
  ) {}

  async findAll(args: TaskFilterArgs = { skip: 0, take: 25 }) {
    const { skip, take, where } = args;
    const tasks = await this.taskRepository.findAndCount({
      relations: ['categories', 'categories.parent', 'series', 'links'],
      where: {
        ...(where
          ? {
              ...('parent' in where
                ? {
                    parent:
                      where.parent === null ? IsNull() : { id: where.parent },
                  }
                : {}),
              ...(where.status?.length
                ? {
                    status: In(where.status),
                  }
                : {}),
              ...(where.type
                ? {
                    type: where.type as TaskType,
                  }
                : {}),
            }
          : {}),
      },
      order: {
        series: { due: 'ASC' },
      },
      take,
      skip,
    });

    return tasks;
  }

  async findOneBy(where: FindOptionsWhere<Task> | FindOptionsWhere<Task>[]) {
    return await this.taskRepository.findOne({
      relations: ['series', 'parent'],
      where,
    });
  }

  async createOrUpdate(input: TaskInput) {
    const { id, categoryIds, links, ...taskData } = input;
    let categories = [];
    let newOrUpdatedTask = null;

    if (categoryIds) {
      categories = await this.taskCategoryRepository.find({
        where: {
          id: In(categoryIds),
        },
      });

      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('Unknown categories.');
      }
    }

    if (id) {
      const task = await this.taskRepository.findOne({
        where: {
          id,
        },
        relations: ['series', 'links', 'assignment'],
      });

      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      newOrUpdatedTask = await this._update(task, categories, taskData);
    } else {
      newOrUpdatedTask = await this._create(categories, taskData);
    }

    if (newOrUpdatedTask.type === TaskType.SERIES) {
      const taskSeries = await this._updateTaskSeries(newOrUpdatedTask);
      newOrUpdatedTask.series = taskSeries;
    }

    newOrUpdatedTask.links = await this.linkService.alignLinks(
      newOrUpdatedTask.links,
      links,
    );

    await this.taskRepository.save(newOrUpdatedTask);

    // return fresh db entity
    return await this.taskRepository.findOne({
      where: { id: newOrUpdatedTask.id },
    });
  }

  async delete(args: DeleteTaskArgs) {
    const { id } = args;

    if (id) {
      const task = await this.taskRepository.findOne({
        relations: ['series'],
        where: {
          id,
        },
      });

      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      return await this.taskRepository.delete(id);
    }

    throw new BadRequestException('Missing ID.');
  }

  protected async _create(
    categories: TaskCategory[],
    input: Partial<TaskInput>,
  ) {
    const task = await this.taskRepository.create({
      ...input,
      categories,
    });

    await this.taskRepository.save(task);

    return task;
  }

  protected async _update(
    task: Task,
    categories: TaskCategory[],
    input: Partial<TaskInput>,
  ) {
    Object.assign(task, input);
    task.categories = categories;

    if (task.type === TaskType.SINGLE && task.series.length) {
      // delete all task series
      this.taskRepository.delete(task.series.map((t) => t.id));
    }

    await this.taskRepository.save(task);

    return task;
  }

  protected async _updateTaskSeries(task: Task) {
    const startDateTime = DateTime.fromJSDate(task.due).toLocal();
    const futureDateTimeStrings = this._getFutureDateTimeStrings(
      startDateTime,
      task.repeat,
    );

    const series: Task[] = task.series ?? [];
    const seriesToUpdate =
      task.series?.filter((t) => {
        return (
          [TaskStatus.OPEN, TaskStatus.PLANNED].includes(t.status) &&
          futureDateTimeStrings.includes(t.due.toISOString())
        );
      }) ?? [];
    const seriesToDelete =
      task.series?.filter(
        (t) =>
          [TaskStatus.OPEN, TaskStatus.PLANNED].includes(t.status) &&
          !futureDateTimeStrings.includes(t.due.toISOString()),
      ) ?? [];
    const seriesDatesToCreate = futureDateTimeStrings.filter(
      (d) => !seriesToUpdate.find((s) => s.due.toISOString() === d),
    );

    for (const taskToUpdate of seriesToUpdate) {
      if (this._diffCheck(task, taskToUpdate)) {
        const { title, categories, expense, factor, priority } = task;
        Object.assign(taskToUpdate, {
          title,
          categories,
          expense,
          factor,
          priority,
        });
        await this.taskRepository.save(taskToUpdate);
      }
    }

    if (seriesToDelete.length) {
      await this.taskRepository.delete(seriesToDelete.map((t) => t.id));
    }

    for (const due of seriesDatesToCreate) {
      const { id, assignment, ...newTask } = task;
      const taskSeriesItem = await this.taskRepository.create({
        ...newTask,
        parent: task,
        series: null,
        type: TaskType.SINGLE,
        due,
        repeat: TaskRepeat.NONE,
      });
      series.push(await this.taskRepository.save(taskSeriesItem));

      // if series is assigned to profile, assign the new task as well
      if (assignment) {
        await this.assignmentService.assignToProfile({
          taskId: taskSeriesItem.id,
          profileId: assignment.profileId,
        });
      }
    }

    return series.filter(
      (t) => !seriesToDelete.map((x) => x.id).includes(t.id),
    );
  }

  protected _getFutureDateTimeStrings(startDateTime, repeat: TaskRepeat) {
    const futureDates = [];

    switch (repeat) {
      case TaskRepeat.WEEKLY:
        for (let i = 0; i < 12; i++) {
          const nextWeek = startDateTime.plus({ weeks: i });
          futureDates.push(
            nextWeek.startOf('week').plus({ days: startDateTime.weekday - 1 }),
          );
        }
        break;

      case TaskRepeat.MONTHLY:
        for (let i = 0; i < 6; i++) {
          const nextMonth = startDateTime.plus({ months: i });
          futureDates.push(
            nextMonth.startOf('week').plus({ days: startDateTime.weekday - 1 }),
          );
        }
        break;

      case TaskRepeat.QUARTERLY:
        for (let i = 0; i < 4; i++) {
          const nextQuarter = startDateTime.plus({ months: i * 3 });
          futureDates.push(nextQuarter.endOf('quarter'));
        }
        break;
    }

    return futureDates.map((d) =>
      d
        .set({
          hour: startDateTime.hour,
          minute: startDateTime.minute,
          second: startDateTime.second,
        })
        .toUTC()
        .toISO(),
    );
  }

  protected _diffCheck(a: Task, b: Task) {
    const keys = ['title', 'categories', 'expense', 'factor', 'priority'];
    const compareA = keys.reduce(
      (o: any, key: string) => ({
        ...o,
        [key]: a[key],
      }),
      {},
    );
    const compareB = keys.reduce(
      (o: any, key: string) => ({
        ...o,
        [key]: b[key],
      }),
      {},
    );
    return JSON.stringify(compareA) !== JSON.stringify(compareB);
  }

  @Cron('0 * * * * *') // every minute
  async handleTaskSeriesJob() {
    this.logger.log('Executing TaskSeries Job');

    // all open tasks with type series
    const openSeriesTasks = await this.taskRepository.find({
      relations: ['categories', 'categories.parent', 'series'],
      where: {
        status: Not(In([TaskStatus.DONE, TaskStatus.CLOSED])),
        type: TaskType.SERIES,
      },
    });

    for (const task of openSeriesTasks) {
      const now = DateTime.now().toUTC().toJSDate();
      const overdueTasks = task.series?.filter(
        (s) =>
          [TaskStatus.OPEN, TaskStatus.PLANNED].includes(s.status) &&
          s.due < now,
      );

      for (const overdueTask of overdueTasks) {
        overdueTask.status = TaskStatus.OVERDUE;
        await this.taskRepository.save(overdueTask);
      }

      // keep initial due date to see, when the series started!?
      // if (overdueTasks.length) {
      //   const nextOpenTask = task.series
      //     .filter((s) => s.status === TaskStatus.OPEN)
      //     .sort((a, b) => b.due.getTime() - a.due.getTime())
      //     .at(0);

      //   if (nextOpenTask) {
      //     task.due = nextOpenTask.due;
      //     await this.taskRepository.save(task);
      //   }
      // }

      const series = await this._updateTaskSeries(task);
      if (
        task.series?.length !== series.length ||
        task.series
          ?.map((s) => s.id)
          .some((id) => !series.map((x) => x.id).includes(id))
      ) {
        task.series = series;
        await this.taskRepository.save(task);
      }
    }
  }
}
