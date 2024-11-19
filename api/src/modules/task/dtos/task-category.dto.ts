import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/dtos/base.dto';

@ObjectType()
export class TaskCategoryDto extends BaseDto {
  @Field()
  public name: string;

  @Field({ nullable: true })
  public parent: TaskCategoryDto;
}
