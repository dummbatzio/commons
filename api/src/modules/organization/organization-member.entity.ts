import { Column, Entity, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import BaseAuditEntity from 'src/common/entities/base-audit.entity';
import User from '../user/user.entity';
import { OrganizationMemberRole } from './enums/organization-member-role.enum';

@Entity()
export class OrganizationMember extends BaseAuditEntity {
  @ManyToOne(() => User, (user) => user.memberships)
  public user: User;

  @ManyToOne(() => Organization, (organization) => organization.members)
  public organization: Organization;

  @Column({
    type: 'enum',
    enum: OrganizationMemberRole,
    default: OrganizationMemberRole.MEMBER,
  })
  public role: OrganizationMemberRole;
}
