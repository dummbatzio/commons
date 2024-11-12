import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAuditDto } from 'src/common/dtos/base-audit.dto';
import { FileDto } from 'src/modules/file/dtos/file.dto';

@ObjectType()
export class OrganizationDto extends BaseAuditDto {
  @Field()
  public name: string;

  @Field({ nullable: true })
  public description: string;

  @Field({ nullable: true })
  public profileImage: FileDto;
}
