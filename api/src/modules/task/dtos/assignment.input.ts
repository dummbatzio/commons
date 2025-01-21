import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AssignmentInput {
  @Field()
  public userId: string;

  @Field()
  public taskId: string;
}
