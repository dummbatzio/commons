import BaseEntity from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class TaskCategory extends BaseEntity {
  @ManyToOne(() => TaskCategory, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  public parent: TaskCategory;

  @Column()
  public name: string;

  // posibility for a default factor, when assigning this category
}
