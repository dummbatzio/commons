import BaseAuditEntity from 'src/common/database/base-audit.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Organization } from './organization.entity';

@Entity()
export class OrganizationMember extends BaseAuditEntity {
  @ManyToOne(() => Profile, (profile) => profile.memberships)
  public profile: Profile;

  @ManyToOne(() => Organization, (organization) => organization.members)
  public organization: Organization;

  @Column({ default: false })
  public isAdmin: boolean;
}
