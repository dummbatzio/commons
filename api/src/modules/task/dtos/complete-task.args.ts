import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CompleteTaskArgs {
  @Field()
  taskId: string;
}
