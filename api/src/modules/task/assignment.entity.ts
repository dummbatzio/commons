import { Task } from './task.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';
import User from '../user/user.entity';

@Entity()
export class Assignment extends BaseAuditEntity {
  // declare join column separately, to be accessible in queries
  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.assignments)
  user: User;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.assignments)
  task: Task;
}
