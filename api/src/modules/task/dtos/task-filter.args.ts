import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dtos/pagination.args';

@InputType()
export class TaskFilterWhereInput {
  @Field({ nullable: true })
  parent?: string | null;

  @Field(() => [String], { nullable: true })
  status?: string[];

  @Field({ nullable: true })
  type?: string;
}

@ArgsType()
export class TaskFilterArgs extends PaginationArgs {
  @Field(() => TaskFilterWhereInput, { nullable: true })
  where?: TaskFilterWhereInput;
}
