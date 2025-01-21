import { Field, ObjectType } from '@nestjs/graphql';
import { TokensDto } from './tokens.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

@ObjectType()
export class SessionDto extends TokensDto {
  @Field()
  user: UserDto;
}
