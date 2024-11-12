import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokensDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
