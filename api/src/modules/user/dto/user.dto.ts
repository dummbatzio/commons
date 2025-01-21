import { Field, ObjectType } from '@nestjs/graphql';
import { AgentoDto } from 'src/common/dtos/agent.dto';

@ObjectType()
export class UserDto extends AgentoDto {
  @Field({ nullable: true })
  public firstname: string;

  @Field({ nullable: true })
  public lastname: string;

  @Field({ nullable: true })
  public bio: string;

  @Field({ nullable: true })
  public phone: string;

  @Field()
  public username: string;

  @Field()
  public email: string;
}
