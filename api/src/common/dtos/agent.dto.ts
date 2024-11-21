import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from './base-audit.dto';
import { FileDto } from 'src/modules/file/dtos/file.dto';
import { VerificationStatus } from '../enums/verification-status.enum';
import { Visibility } from '../enums/visibility.enum';

@ObjectType()
export class AgentoDto extends BaseAuditDto {
  @Field({ nullable: true })
  public avatar: FileDto;

  @Field()
  public status: VerificationStatus;

  @Field()
  public visibility: Visibility;
}
