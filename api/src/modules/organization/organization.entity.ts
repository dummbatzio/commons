import BaseAuditEntity from 'src/common/database/base-audit.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrganizationMember } from './organization-member.entity';
import { Wallet } from '../wallet/wallet.entity';
import { File } from '../file/file.entity';

@Entity()
export class Organization extends BaseAuditEntity {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @ManyToOne(() => File, { nullable: true, eager: true })
  @JoinColumn({ name: 'profile_image_id' })
  public profileImage: File;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.organization,
  )
  public members: OrganizationMember[];

  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;

  // events
}
