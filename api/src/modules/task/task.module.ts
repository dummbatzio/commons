import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskCategory } from './task-category.entity';
import { Assignment } from './assignment.entity';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { TaskCategoryService } from './task-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskCategory, Assignment])],
  providers: [TaskResolver, TaskService, TaskCategoryService],
})
export class TaskModule {}
