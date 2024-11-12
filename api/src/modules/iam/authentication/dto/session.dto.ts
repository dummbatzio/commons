import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../user/dto/user.dto';
import { TokensDto } from './tokens.dto';

@ObjectType()
export class SessionDto extends TokensDto {
  @Field()
  user: UserDto;
}
