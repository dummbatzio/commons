import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { ProfileType } from '../enums/profile-type.enum';

@ObjectType()
export class ProfileDto extends BaseAuditDto {
  @Field()
  public type: ProfileType;
}
