import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

@ObjectType()
export class TaskAssignmentDto extends BaseAuditDto {
  @Field()
  public user: UserDto;
}
