import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { In, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dtos/pagination.input';
import { DeleteTaskArgs, TaskInput } from './dtos/task.input';
import { TaskCategory } from './task-category.entity';

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

    await this.taskRepository.save(task);

    return task;
  }
}
