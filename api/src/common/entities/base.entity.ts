import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}

export default BaseEntity;
