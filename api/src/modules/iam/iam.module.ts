import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication/authentication.service';
import jwtConfig from './authentication/config/jwt.config';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationResolver } from './authentication/authentication.resolver';
import { RedisModule } from 'src/common/database/redis.module';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user/user.entity';
import { ProfileModule } from '../profile/profile.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { FileModule } from '../file/file.module';
import Agent from 'src/common/entities/agent.entity';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Agent, User]),
    RedisModule,
    ProfileModule,
    FileModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    AuthenticationService,
    AuthenticationResolver,
    RefreshTokenIdsStorage,
    UserService,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class IamModule {}
