import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { WalletResolver } from './wallet.resolver';
import { WalletService } from './wallet.service';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
    forwardRef(() => UserModule),
    OrganizationModule,
  ],
  providers: [WalletResolver, WalletService],
  exports: [WalletService],
})
export class WalletModule {}
