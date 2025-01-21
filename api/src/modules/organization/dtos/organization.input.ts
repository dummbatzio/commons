import { Field, InputType } from '@nestjs/graphql';
import { AgentInput } from 'src/common/dtos/agent.input';

@InputType()
export class OrganizationInput extends AgentInput {
  @Field({ nullable: true })
  public name: string;

  @Field({ nullable: true })
  public description: string;
}
