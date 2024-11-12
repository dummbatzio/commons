import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignUpInput } from './dto/sign-up.input';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { ActiveUser } from './decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { UserService } from '../user/user.service';
import { SignInInput } from './dto/sign-in.input';
import { UserDto } from '../user/dto/user.dto';
import { SessionDto } from './dto/session.dto';
import { TokensDto } from './dto/tokens.dto';

@Auth(AuthType.None)
@Resolver()
export class AuthenticationResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthenticationService,
  ) {}

  @Auth(AuthType.Bearer)
  @Query(() => UserDto, { name: 'me' })
  async me(@ActiveUser() user: ActiveUserData) {
    return this.userService.findOneBy({ id: user.sub });
  }

  @Mutation(() => UserDto, { name: 'signUp' })
  async signUp(
    @Args('input')
    signUpInput: SignUpInput,
  ) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => SessionDto, { name: 'signIn' })
  async signIn(
    @Args('input')
    signInInput: SignInInput,
  ) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => TokensDto, { name: 'refreshTokens' })
  async refreshTokens(
    @Args('token')
    refreshToken: string,
  ) {
    return this.authService.refreshTokens(refreshToken);
  }
}
