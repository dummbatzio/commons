import { Field, ID, InputType } from '@nestjs/graphql';
import { Visibility } from '../enums/visibility.enum';

@InputType()
export class AgentInput {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  public avatarId: string;

  @Field({ nullable: true })
  public visibility: Visibility;
}
