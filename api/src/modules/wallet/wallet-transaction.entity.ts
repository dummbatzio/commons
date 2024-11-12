import BaseAuditEntity from 'src/common/database/base-audit.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletTransaction extends BaseAuditEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  public profile: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { nullable: true })
  public sender: Wallet;

  @Column({ type: 'int' })
  public amount: number;

  @Column()
  public comment: string;

  // TODO: after save - update both wallet balances...
}
