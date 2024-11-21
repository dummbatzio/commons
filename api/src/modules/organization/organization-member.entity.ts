import { Column, Entity, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import User from '../iam/user/user.entity';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';

@Entity()
export class OrganizationMember extends BaseAuditEntity {
  @ManyToOne(() => User, (user) => user.memberships)
  public user: User;

  @ManyToOne(() => Organization, (organization) => organization.members)
  public organization: Organization;

  @Column({ default: false })
  public isAdmin: boolean;
}
