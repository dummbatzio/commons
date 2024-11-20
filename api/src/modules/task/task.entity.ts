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
import { TaskRepeat } from './enums/task-repeat.enum';

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

  @Column({ default: TaskPriority.NONE })
  public priority: TaskPriority;

  @ManyToMany(() => TaskCategory, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  categories: TaskCategory[];

  @Column({ type: 'int', nullable: true })
  public expense: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  public factor: number;

  @Column({ nullable: true })
  public due: Date;

  @Column({ nullable: true, default: TaskRepeat.NONE })
  public repeat: TaskRepeat;

  @ManyToOne(() => Task, (task) => task.series, {
    nullable: true,
  })
  public parent: Task;

  @OneToMany(() => Task, (task) => task.parent, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  public series: Task[];

  @OneToMany(() => Assignment, (assignment) => assignment.task)
  public assignment: Assignment;
}
