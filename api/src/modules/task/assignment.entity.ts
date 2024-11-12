import BaseAuditEntity from 'src/common/database/base-audit.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AssignmentStatus } from './enums/assignment-status.enum';
import { Profile } from '../profile/profile.entity';
import { Task } from './task.entity';

@Entity()
export class Assignment extends BaseAuditEntity {
  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.DOING,
  })
  status: AssignmentStatus;

  @ManyToOne(() => Profile, (profile) => profile.assignments, {
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @ManyToOne(() => Task, (task) => task.assignment, {
    onDelete: 'CASCADE',
  })
  task: Task;
}
