import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseDto {
  @Field(() => ID)
  public id: string;
}
