import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { BaseDto } from './base.dto';

@ObjectType()
export class BaseAuditDto extends BaseDto {
  @Field(() => GraphQLISODateTime)
  public createdAt: Date;

  @Field(() => GraphQLISODateTime)
  public updatedAt: Date;
}
