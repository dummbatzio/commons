import { Column, Entity, ManyToOne } from 'typeorm';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';
import { TransactionType } from './enums/transaction-type.enum';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletTransaction extends BaseAuditEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  public wallet: Wallet;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'int' })
  public amount: number;

  @Column({ nullable: true })
  public comment: string;
}
