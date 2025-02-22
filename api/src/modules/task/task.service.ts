import {
  BadRequestException,
  Injectable,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { FindOptionsWhere, Not, In, Repository } from 'typeorm';
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
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { WalletService } from '../wallet/wallet.service';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name, { timestamp: true });

  constructor(
    private readonly userService: UserService,
    private readonly linkService: TaskLinkService,
    private readonly walletService: WalletService,
    private readonly assignmentService: AssignmentService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskCategory)
    private taskCategoryRepository: Repository<TaskCategory>,
  ) {}

  async findAll(args: TaskFilterArgs = { skip: 0, take: 25 }) {
    const query = await this.getAllTasksQuery(args);

    return await query.getManyAndCount();
  }

  async findAllByUser(
    args: TaskFilterArgs = { skip: 0, take: 25 },
    userId: string,
  ) {
    const query = await this.getAllTasksQuery(args);

    query.andWhere('assignment.userId = :userId', {
      userId,
    });

    return await query.getManyAndCount();
  }

  private async getAllTasksQuery(args: TaskFilterArgs) {
    const { skip, take, where } = args;
    const query = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignments', 'assignment')
      .leftJoinAndSelect('task.categories', 'category')
      .leftJoinAndSelect('category.parent', 'parentCategory')
      .leftJoinAndSelect('task.series', 'series')
      .leftJoinAndSelect('task.links', 'links')
      .orderBy('task.due', 'ASC')
      .take(take)
      .skip(skip);

    if ('parent' in where) {
      if (where.parent === null) {
        query.andWhere('task.parent Is Null');
      } else {
        query.andWhere('task.parent.id = :parentId', {
          parentId: where.parent,
        });
      }
    }

    if (where.status?.length) {
      query.andWhere('task.status IN (:...statuses)', {
        statuses: where.status,
      });
    }

    if (where.type) {
      query.andWhere('task.type = :type', {
        type: where.type,
      });
    }

    return query;
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

  async complete(taskId: string, currentUser?: ActiveUserData) {
    const task = await this.findOneBy({ id: taskId });
    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    const user = await this.userService.findOneBy({
      id: currentUser.sub,
    });
    if (user) {
      if (task.assignments.every((a) => a.userId !== user.id)) {
        throw new MethodNotAllowedException(
          'User is not allowed to complete this task.',
        );
      }

      // TODO: SPLIT AMOUNT TO ASSIGNED WALLETS
      const amount = task.expense * task.factor;
      this.walletService.deposit({
        amount,
        walletId: user.wallet.id,
        comment: `Aufgabe #${task.id}: ${task.title}`,
      });
    }

    task.status = TaskStatus.DONE;
    await this.taskRepository.save(task);

    return task;
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
      // if there is already a series task (any status), continue
      if (series.find((x) => x.due.toISOString() === due)) {
        continue;
      }

      const { id, assignments, ...newTask } = task;
      const taskSeriesItem = await this.taskRepository.create({
        ...newTask,
        parent: task,
        series: null,
        type: TaskType.SINGLE,
        due,
        repeat: TaskRepeat.NONE,
      });
      series.push(await this.taskRepository.save(taskSeriesItem));

      // if series is assigned to user, assign the new task as well
      if (assignments?.length) {
        assignments.map(
          async (assignment) =>
            await this.assignmentService.assignToUser(
              {
                taskId: taskSeriesItem.id,
                userId: assignment.userId,
              },
              assignment.userId,
            ),
        );
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
