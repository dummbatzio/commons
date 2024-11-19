import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';

@ArgsType()
export class TaskCategoryArgs {
  @Field({ nullable: true })
  parentId: string;

  @Field({ nullable: true })
  @Min(3)
  @IsOptional()
  nameLike: string;
}

@InputType()
export class TaskCategoryInput extends BaseDto {
  @Field({ nullable: true })
  public parentId: string;

  @Field()
  public name: string;
}
