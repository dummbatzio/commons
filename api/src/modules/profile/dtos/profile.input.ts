import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProfileInput {
  @Field({ nullable: true })
  public id: string;
}
