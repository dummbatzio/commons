import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskInput } from './dtos/task.input';
import { TaskDto } from './dtos/task.dto';
import { PaginationArgs } from 'src/common/dtos/pagination.input';
import { TaskService } from './task.service';
import { PaginatedTasksDto } from './dtos/paginated-tasks.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { TaskCategoryService } from './task-category.service';
import {
  TaskCategoryArgs,
  TaskCategoryInput,
} from './dtos/task-category.input';
import { TaskCategoryDto } from './dtos/task-category.dto';

@Resolver()
@Auth(AuthType.None)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskCategoryService: TaskCategoryService,
  ) {}

  // todo: filter status, filter type
  @Query(() => PaginatedTasksDto, { name: 'tasks' })
  async findAllTasks(@Args() args: PaginationArgs) {
    const [items, totalCount] = await this.taskService.findAll(args);

    return {
      totalCount,
      skip: args.skip,
      take: args.take,
      items,
    };
  }

  @Mutation(() => TaskDto, { name: 'createTask' })
  async createTask(@Args('input') input: TaskInput) {
    return this.taskService.create(input);
  }

  @Query(() => [TaskCategoryDto], { name: 'taskCategories' })
  async findAllTaskCategories(@Args() args: TaskCategoryArgs) {
    return this.taskCategoryService.findAll(args);
  }

  @Mutation(() => TaskCategoryDto, { name: 'createTaskCategory' })
  async createTaskCategory(@Args('input') input: TaskCategoryInput) {
    return this.taskCategoryService.create(input);
  }
}
