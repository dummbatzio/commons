import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { Visibility } from 'src/common/enums/visibility.enum';
import { FileDto } from 'src/modules/file/dtos/file.dto';

@ObjectType()
export class ProfileDto extends BaseAuditDto {
  @Field({ nullable: true })
  public firstname: string;

  @Field({ nullable: true })
  public lastname: string;

  @Field({ nullable: true })
  public bio: string;

  @Field({ nullable: true })
  public avatar: FileDto;

  @Field()
  public status: VerificationStatus;

  @Field()
  public visibility: Visibility;
}
