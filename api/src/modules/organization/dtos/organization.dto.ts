import { Field, ObjectType } from '@nestjs/graphql';
import { AgentoDto } from 'src/common/dtos/agent.dto';
import { FileDto } from 'src/modules/file/dtos/file.dto';

@ObjectType()
export class OrganizationDto extends AgentoDto {
  @Field()
  public name: string;

  @Field({ nullable: true })
  public description: string;

  @Field({ nullable: true })
  public profileImage: FileDto;
}
