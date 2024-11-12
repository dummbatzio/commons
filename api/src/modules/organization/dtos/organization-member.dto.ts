import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { ProfileDto } from 'src/modules/profile/dtos/profile.dto';

@ObjectType()
export class OrganizationMemberDto extends BaseAuditDto {
  @Field()
  public profile: ProfileDto;

  @Field()
  public isAdmin: boolean;
}
