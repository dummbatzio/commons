import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AssignmentInput {
  @Field()
  public profileId: string;

  @Field()
  public taskId: string;
}
