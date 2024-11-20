import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { In, IsNull, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dtos/pagination.input';
import { DeleteTaskArgs, TaskInput } from './dtos/task.input';
import { TaskCategory } from './task-category.entity';
import { TaskType } from './enums/task-type.enum';
import { TaskStatus } from './enums/task-status.enum';
import { TaskRepeat } from './enums/task-repeat.enum';
import { DateTime } from 'luxon';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskCategory)
    private taskCategoryRepository: Repository<TaskCategory>,
  ) {}

  async findAll(args: PaginationArgs = { skip: 0, take: 25 }) {
    const { skip, take } = args;
    const tasks = await this.taskRepository.findAndCount({
      relations: ['categories', 'categories.parent'],
      where: { parent: IsNull() },
      take,
      skip,
    });

    return tasks;
  }

  async createOrUpdate(input: TaskInput) {
    const { id, categoryIds, ...taskData } = input;
    let categories = [];

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
        relations: ['series'],
      });

      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      return await this._update(task, categories, taskData);
    }

    return await this._create(categories, taskData);
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

    if (task.type === TaskType.SERIES) {
      const taskSeries = await this._updateTaskSeries(task);
      task.series = taskSeries;
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
    const seriesToUpdate = task.series.filter((t) => {
      return (
        t.status === TaskStatus.OPEN &&
        futureDateTimeStrings.includes(t.due.toISOString())
      );
    });
    const seriesToDelete = task.series.filter(
      (t) =>
        t.status === TaskStatus.OPEN &&
        !futureDateTimeStrings.includes(t.due.toISOString()),
    );
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
      const { id, ...newTask } = task;
      const taskSeriesItem = await this.taskRepository.create({
        ...newTask,
        parent: task,
        type: TaskType.SINGLE,
        due,
        repeat: TaskRepeat.NONE,
      });
      series.push(await this.taskRepository.save(taskSeriesItem));
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
          futureDates.push(
            nextQuarter
              .startOf('week')
              .plus({ days: startDateTime.weekday - 1 }),
          );
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

  protected async _checkTaskSeries() {
    // all open tasks with type series
    // check expired tasks (status = open && due < now) --> TaskStatus.OVERDUE
    // _updateTaskSeries
  }
}
