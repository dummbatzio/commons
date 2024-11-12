import { Field, ObjectType } from '@nestjs/graphql';
import { TaskType } from '../enums/task-type.enum';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskCategoryDto } from './task-category.dto';

@ObjectType()
export class TaskDto extends BaseAuditDto {
  @Field()
  public title: string;

  @Field({ nullable: true })
  public description: string;

  @Field()
  public status: TaskStatus;

  @Field({ nullable: true })
  public type: TaskType;

  @Field(() => [TaskCategoryDto], { nullable: true })
  categories: TaskCategoryDto[];

  @Field()
  public expense: number;

  @Field()
  public factor: number;

  @Field({ nullable: true })
  public due: Date;
}
