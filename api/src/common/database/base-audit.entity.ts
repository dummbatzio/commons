import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import BaseEntity from './base.entity';

@Entity()
abstract class BaseAuditEntity extends BaseEntity {
  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}

export default BaseAuditEntity;
