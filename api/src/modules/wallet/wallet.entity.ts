import { Entity, OneToMany } from 'typeorm';
import { WalletTransaction } from './wallet-transaction.entity';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';

@Entity()
export class Wallet extends BaseAuditEntity {
  @OneToMany(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.wallet,
  )
  public transactions: WalletTransaction[];
}
