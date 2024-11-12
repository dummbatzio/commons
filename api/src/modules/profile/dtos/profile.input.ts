import { Field, InputType } from '@nestjs/graphql';
import { Visibility } from 'src/common/enums/visibility.enum';

@InputType()
export class ProfileInput {
  @Field({ nullable: true })
  public id: string;

  @Field({ nullable: true })
  public avatarId: string;

  @Field({ nullable: true })
  public firstname: string;

  @Field({ nullable: true })
  public lastname: string;

  @Field({ nullable: true })
  public bio: string;

  @Field({ nullable: true })
  public visibility: Visibility;
}
