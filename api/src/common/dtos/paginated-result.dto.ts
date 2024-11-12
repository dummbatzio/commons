import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function PaginatedResultDto<T>(ItemType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResult {
    @Field(() => Int)
    totalCount: number;

    @Field(() => Int)
    skip: number;

    @Field(() => Int)
    take: number;

    @Field(() => [ItemType])
    items: T[];
  }

  return PaginatedResult;
}
