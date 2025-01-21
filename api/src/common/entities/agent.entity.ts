import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Visibility } from '../enums/visibility.enum';
import { VerificationStatus } from '../enums/verification-status.enum';
import BaseAuditEntity from './base-audit.entity';
import { File } from 'src/modules/file/file.entity';
import { Wallet } from 'src/modules/wallet/wallet.entity';

@Entity()
abstract class Agent extends BaseAuditEntity {
  @ManyToOne(() => File, { nullable: true, eager: true })
  @JoinColumn({ name: 'avatar_id' })
  public avatar: File;

  @Column({
    type: 'varchar',
    length: 100,
    default: VerificationStatus.UNVERIFIED,
  })
  status: VerificationStatus;

  @Column({ type: 'varchar', length: 100, default: Visibility.PRIVATE })
  visibility: Visibility;

  @OneToOne(() => Wallet, { nullable: true, eager: true })
  @JoinColumn()
  wallet: Wallet;
}

export default Agent;
