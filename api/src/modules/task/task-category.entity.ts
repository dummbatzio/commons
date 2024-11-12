import BaseEntity from 'src/common/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class TaskCategory extends BaseEntity {
  @Column()
  public name: string;

  // posibility for a default factor, when assigning this category
}
