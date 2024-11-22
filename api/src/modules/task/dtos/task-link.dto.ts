import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/dtos/base.dto';

@ObjectType()
export class TaskLinkDto extends BaseDto {
  @Field()
  public label: string;

  @Field()
  public url: string;
}
