import { Column, Entity, OneToMany } from 'typeorm';
import { WalletTransaction } from './wallet-transaction.entity';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';

@Entity()
export class Wallet extends BaseAuditEntity {
  @Column({ type: 'int', default: 0 })
  public balance: number;

  @OneToMany(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.id,
  )
  public transactions: WalletTransaction[];
}
