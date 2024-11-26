import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeleteTaskArgs, TaskInput } from './dtos/task.input';
import { TaskDto } from './dtos/task.dto';
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
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { AssignmentService } from './assignment.service';
import { AssignmentInput } from './dtos/assignment.input';
import { AssignmentDto } from './dtos/assignment.dto';
import { TaskFilterArgs } from './dtos/task-filter.args';
import { CompleteTaskArgs } from './dtos/complete-task.args';

@Resolver()
@Auth(AuthType.Bearer)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskCategoryService: TaskCategoryService,
    private readonly assignmentService: AssignmentService,
  ) {}

  @Query(() => PaginatedTasksDto, { name: 'tasks' })
  async findAllTasks(@Args() args: TaskFilterArgs) {
    const [items, totalCount] = await this.taskService.findAll(args);

    return {
      totalCount,
      skip: args.skip,
      take: args.take,
      items,
    };
  }

  @Query(() => PaginatedTasksDto, { name: 'myTasks' })
  async findMyTasks(
    @Args() args: TaskFilterArgs,
    @ActiveUser() user: ActiveUserData,
  ) {
    const [items, totalCount] = await this.taskService.findAllByUser(
      args,
      user.sub,
    );

    return {
      totalCount,
      skip: args.skip,
      take: args.take,
      items,
    };
  }

  @Mutation(() => TaskDto, { name: 'createTask' })
  async createTask(@Args('input') input: TaskInput) {
    return this.taskService.createOrUpdate(input);
  }

  @Mutation(() => TaskDto, { name: 'updateTask' })
  async updateTask(@Args('input') input: TaskInput) {
    return this.taskService.createOrUpdate(input);
  }

  @Mutation(() => Boolean, { name: 'deleteTask' })
  async deleteTask(@Args() args: DeleteTaskArgs) {
    await this.taskService.delete(args);
    return true;
  }

  @Mutation(() => Boolean, { name: 'assignTask' })
  async assignTask(
    @Args('input') input: AssignmentInput,
    @ActiveUser() user: ActiveUserData,
  ) {
    await this.assignmentService.assignToUser(input, user);
    return true;
  }

  @Mutation(() => TaskDto, { name: 'completeTask' })
  async completeTask(
    @Args() args: CompleteTaskArgs,
    @ActiveUser() user: ActiveUserData,
  ) {
    return await this.taskService.complete(args.taskId, user);
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
