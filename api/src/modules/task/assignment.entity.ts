import { Column, Entity, ManyToOne } from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Task } from './task.entity';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';

@Entity()
export class Assignment extends BaseAuditEntity {
  @Column({ nullable: true })
  profileId: string;

  @ManyToOne(() => Profile, (profile) => profile.assignments, {
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @Column({ nullable: true })
  taskId: string;

  @ManyToOne(() => Task, (task) => task.assignment, {
    onDelete: 'CASCADE',
  })
  task: Task;
}
