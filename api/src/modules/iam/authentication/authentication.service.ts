import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { randomUUID } from 'crypto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { UserService } from '../user/user.service';
import { RefreshTokenIdData } from '../interfaces/refresh-token-id-data.interface';
import User from '../user/user.entity';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpInput: SignUpInput) {
    const { username, email, password } = signUpInput;

    const user = await this.userService.findOneBy({
      email,
    });

    if (user) {
      throw new ForbiddenException('User with this email already exists');
    }

    return await this.userService.create({
      username,
      email,
      password: await this.hashingService.hash(password),
    });
  }

  async signIn(signInInput: SignInInput) {
    const user = await this.userService.findOneBy({
      email: signInInput.email,
    });

    if (!user) {
      throw new UnauthorizedException('User with this email does not exist.');
    }

    const isEqual = await this.hashingService.compare(
      signInInput.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Wrong password.');
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user,
    };
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, username: user.username },
      ),
      this.signToken<RefreshTokenIdData>(
        user.id,
        this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
        },
      ),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & RefreshTokenIdData
      >(refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.userService.findOneByOrFail({
        id: sub,
      });

      // refresh token rotation
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }

      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        // Take action: notify user that his refresh token might have been stolen?
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
