import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';

@ObjectType()
export class OrganizationMemberDto extends BaseAuditDto {
  @Field()
  public user: UserDto;

  @Field()
  public role: OrganizationMemberRole;
}
