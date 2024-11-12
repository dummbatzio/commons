import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileDto {
  @Field()
  public filename: string;

  @Field()
  public path: string;

  @Field({ nullable: true })
  public mimetype: string;
}
