import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { Visibility } from 'src/common/enums/visibility.enum';
import BaseAuditEntity from 'src/common/database/base-audit.entity';
import { File } from '../file/file.entity';
import { OrganizationMember } from '../organization/organization-member.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Assignment } from '../task/assignment.entity';

@Entity()
export class Profile extends BaseAuditEntity {
  @ManyToOne(() => File, { nullable: true, eager: true })
  @JoinColumn({ name: 'avatar_id' })
  public avatar: File;

  @Column({ nullable: true })
  public firstname: string;

  @Column({ nullable: true })
  public lastname: string;

  @Column({ nullable: true })
  public bio: string;

  @Column({ nullable: true })
  public phone: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: VerificationStatus.UNVERIFIED,
  })
  status: VerificationStatus;

  @Column({ type: 'varchar', length: 100, default: Visibility.PRIVATE })
  visibility: Visibility;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.profile,
  )
  memberships: OrganizationMember[];

  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;

  @OneToMany(() => Assignment, (assignment) => assignment.profile)
  assignments: Assignment[];
}
