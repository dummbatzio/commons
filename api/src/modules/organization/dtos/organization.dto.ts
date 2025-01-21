import { Field, ObjectType } from '@nestjs/graphql';
import { AgentoDto } from 'src/common/dtos/agent.dto';

@ObjectType()
export class OrganizationDto extends AgentoDto {
  @Field()
  public name: string;

  @Field({ nullable: true })
  public description: string;
}
