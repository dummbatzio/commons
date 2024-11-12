import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileResolver } from './profile.resolver';
import { IamModule } from '../iam/iam.module';
import { FileModule } from '../file/file.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    forwardRef(() => IamModule),
    FileModule,
    WalletModule,
  ],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
