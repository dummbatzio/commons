import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { AssignmentStatus } from '../enums/assignment-status.enum';

@ObjectType()
export class AssignmentDto extends BaseAuditDto {
  @Field()
  public status: AssignmentStatus;
}
