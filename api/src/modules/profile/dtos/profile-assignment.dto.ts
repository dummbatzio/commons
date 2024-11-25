import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { TaskDto } from 'src/modules/task/dtos/task.dto';

@ObjectType()
export class ProfileAssignmentDto extends BaseAuditDto {
  @Field()
  public task: TaskDto;
}
