import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileModule } from '../file/file.module';
import { WalletModule } from '../wallet/wallet.module';
import Agent from 'src/common/entities/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, User]), FileModule, WalletModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
