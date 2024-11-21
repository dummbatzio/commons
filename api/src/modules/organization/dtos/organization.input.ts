import { Field, ID, InputType } from '@nestjs/graphql';
import { AgentInput } from 'src/common/dtos/agent.input';

@InputType()
export class OrganizationInput extends AgentInput {
  @Field({ nullable: true })
  public name: string;

  @Field({ nullable: true })
  public description: string;

  @Field(() => ID, { nullable: true })
  public profileImageId: string;

  // @IsOptional()
  // @Field({ nullable: true })
  // public memberProfiles: ProfileDto[];
}
