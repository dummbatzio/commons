import { Field, ID, InputType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/dtos/base.dto';

@InputType()
export class TaskLinkInput extends BaseDto {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  public label: string;

  @Field()
  public url: string;
}
