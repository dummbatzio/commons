import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { UserDto } from 'src/modules/iam/user/dto/user.dto';

@ObjectType()
export class OrganizationMemberDto extends BaseAuditDto {
  @Field()
  public user: UserDto;

  @Field()
  public isAdmin: boolean;
}
