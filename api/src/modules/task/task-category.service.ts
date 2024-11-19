import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { parentId, nameLike } = args;
    let parent = null;

    if (parentId) {
      parent = await this.taskCategoryRepository.findOne({
        where: {
          id: parentId,
        },
      });

      if (!parent) {
        return [];
      }
    }

    const taskCategories = await this.taskCategoryRepository.find({
      where: {
        parent,
        name: Like(`%${nameLike ?? ''}%`),
      },
    });

    return taskCategories;
  }

  async create(input: TaskCategoryInput) {
    const { parentId, ...taskCategoryInput } = input;
    let parentTaskCategory = null;
    if (parentId) {
      parentTaskCategory = await this.taskCategoryRepository.findOne({
        where: {
          id: parentId,
        },
      });

      if (!parentTaskCategory) {
        throw new NotFoundException('Parent TaskCategory not found.');
      }
    }

    const taskCategory =
      await this.taskCategoryRepository.create(taskCategoryInput);
    taskCategory.parent = parentTaskCategory;

    await this.taskCategoryRepository.save(taskCategory);

    return taskCategory;
  }
}
