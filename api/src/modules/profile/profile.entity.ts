import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { Assignment } from '../task/assignment.entity';
import { ProfileType } from './enums/profile-type.enum';
import User from '../iam/user/user.entity';
import { Organization } from '../organization/organization.entity';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';

@Entity()
export class Profile extends BaseAuditEntity {
  @Column({
    type: 'enum',
    enum: ProfileType,
  })
  type: ProfileType;

  @OneToOne(() => User, (user) => user.profile, { nullable: true })
  user: User;

  @OneToOne(() => Organization, (organization) => organization.profile, {
    nullable: true,
  })
  organization: Organization;

  @OneToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;

  @OneToMany(() => Assignment, (assignment) => assignment.profile)
  assignments: Assignment[];
}
