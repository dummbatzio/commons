import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { WalletResolver } from './wallet.resolver';
import { IamModule } from '../iam/iam.module';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletTransaction])],
  providers: [WalletResolver, WalletService],
  exports: [WalletService],
})
export class WalletModule {}
