import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from 'src/common/entities/base.entity';
import { Task } from './task.entity';

@Entity()
export class TaskLink extends BaseEntity {
  @Column()
  label: string;

  @Column()
  url: string;

  @ManyToOne(() => Task, (task) => task.links, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  task: Task;
}
