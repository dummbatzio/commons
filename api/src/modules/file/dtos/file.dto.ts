import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from 'src/common/dtos/base.dto';

@ObjectType()
export class FileDto extends BaseDto {
  @Field()
  public filename: string;

  @Field()
  public path: string;

  @Field({ nullable: true })
  public mimetype: string;
}
