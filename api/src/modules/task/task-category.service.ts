import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TaskCategory } from './task-category.entity';
import {
  TaskCategoryArgs,
  TaskCategoryInput,
} from './dtos/task-category.input';

@Injectable()
export class TaskCategoryService {
  constructor(
    @InjectRepository(TaskCategory)
    private taskCategoryRepository: Repository<TaskCategory>,
  ) {}

  async findAll(args: TaskCategoryArgs) {
    const { nameLike } = args;
    const taskCategories = await this.taskCategoryRepository.find({
      where: {
        name: Like(`%${nameLike ?? ''}%`),
      },
    });

    return taskCategories;
  }

  async create(input: TaskCategoryInput) {
    const taskCategory = await this.taskCategoryRepository.create(input);

    await this.taskCategoryRepository.save(taskCategory);

    return taskCategory;
  }
}
