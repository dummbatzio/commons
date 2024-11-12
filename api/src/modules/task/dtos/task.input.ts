import { Field, InputType } from '@nestjs/graphql';
import { TaskType } from '../enums/task-type.enum';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';

@InputType()
export class TaskInput extends BaseAuditDto {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  type: TaskType;

  @Field(() => [String], { nullable: true })
  categoryIds: string[];

  @Field({ defaultValue: 0.0 })
  expense: number;

  @Field({ defaultValue: 1.0 })
  factor: number;

  @Field({ nullable: true })
  due: Date;
}
