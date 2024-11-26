import { Column, Entity, ManyToOne } from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Task } from './task.entity';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';

@Entity()
export class Assignment extends BaseAuditEntity {
  @Column()
  profileId: string;

  @ManyToOne(() => Profile, (profile) => profile.assignments, {
    onDelete: 'CASCADE',
    eager: false,
  })
  profile: Profile;

  @Column()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.assignments, {
    onDelete: 'CASCADE',
    eager: false,
  })
  task: Task;
}
