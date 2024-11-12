import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { In, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dtos/pagination.input';
import { TaskInput } from './dtos/task.input';
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

  async create(input: TaskInput) {
    const { categoryIds, ...taskData } = input;
    let categories = null;

    console.log(input);

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

    console.log({
      ...taskData,
      categories,
    });

    const task = await this.taskRepository.create({
      ...taskData,
      categories,
    });

    await this.taskRepository.save(task);

    return task;
  }
}
