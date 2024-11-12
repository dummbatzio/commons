import BaseAuditEntity from 'src/common/database/base-audit.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TaskCategory } from './task-category.entity';
import { TaskType } from './enums/task-type.enum';
import { TaskStatus } from './enums/task-status.enum';
import { Assignment } from './assignment.entity';
import { TaskPriority } from './enums/task-priority.enum';

@Entity()
export class Task extends BaseAuditEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.SINGLE,
  })
  type: TaskType;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.NONE })
  public priority: TaskPriority;

  @ManyToMany(() => TaskCategory, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  categories: TaskCategory[];

  @Column({ type: 'int', nullable: true })
  public expense: number;

  @Column({ type: 'decimal' })
  public factor: number;

  @Column({ nullable: true })
  public due: Date;

  @ManyToOne(() => Task, (task) => task.series, { nullable: true })
  public parent: Task;

  @OneToMany(() => Task, (task) => task.parent, { nullable: true })
  public series: Task[];

  @OneToMany(() => Assignment, (assignment) => assignment.task)
  public assignment: Assignment;
}
