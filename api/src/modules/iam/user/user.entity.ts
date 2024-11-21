import Agent from 'src/common/entities/agent.entity';
import { OrganizationMember } from 'src/modules/organization/organization-member.entity';
import { Profile } from 'src/modules/profile/profile.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
class User extends Agent {
  @Column({ unique: true })
  public email: string;

  @Column({ unique: true, nullable: true })
  public username: string;

  @Column({ nullable: true })
  public firstname: string;

  @Column({ nullable: true })
  public lastname: string;

  @Column({ nullable: true })
  public bio: string;

  @Column({ nullable: true })
  public phone: string;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.user,
  )
  memberships: OrganizationMember[];

  @Column()
  public password: string;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public profile: Profile;
}

export default User;
