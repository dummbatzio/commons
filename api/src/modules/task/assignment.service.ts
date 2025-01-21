import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { Assignment } from './assignment.entity';
import { TaskStatus } from './enums/task-status.enum';
import { AssignmentInput } from './dtos/assignment.input';
import { TaskType } from './enums/task-type.enum';
import { Task } from './task.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async assignToCurrentUser(
    input: AssignmentInput,
    currentUser: ActiveUserData,
  ) {
    const user = await this.userService.findOneBy({
      id: currentUser.sub,
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return await this.assignToUser(input, user.id);
  }

  async assignToUser(input: AssignmentInput, userId: string) {
    const task = await this.taskRepository.findOne({
      relations: ['series'],
      where: {
        id: input.taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found.');
    }
    if (![TaskStatus.OPEN, TaskStatus.PLANNED].includes(task.status)) {
      throw new MethodNotAllowedException('Cannot assign unopen task.');
    }

    const assignmentsData = [
      {
        userId,
        taskId: task.id,
      },
      ...(task.type === TaskType.SERIES && task.series?.length
        ? task.series.map((s: any) => ({
            userId,
            taskId: s.id,
          }))
        : []),
    ];

    const assignments = assignmentsData.map((data) =>
      this.assignmentRepository.create(data),
    );

    await this.assignmentRepository.save(assignments);

    const tasksToUpdate = await this.taskRepository.find({
      where: {
        id: In(assignments.map((a) => a.taskId)),
      },
    });

    for (const t of tasksToUpdate) {
      t.status = TaskStatus.PLANNED;
      await this.taskRepository.save(t);
    }
  }
}
