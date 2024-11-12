import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/dtos/base.dto';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { ProfileDto } from 'src/modules/profile/dtos/profile.dto';

@ObjectType()
export class UserDto extends BaseDto {
  @Field()
  public username: string;

  @Field()
  public email: string;

  @Field()
  public status: VerificationStatus;

  @Field({ nullable: true })
  public profile: ProfileDto;
}
