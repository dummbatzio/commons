import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { TaskDto } from './task.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

@ObjectType()
export class AssignmentDto extends BaseAuditDto {
  @Field()
  public user: UserDto;

  @Field()
  public task: TaskDto;
}
