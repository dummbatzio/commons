import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrganizationMember } from './organization-member.entity';
import { File } from '../file/file.entity';
import Agent from 'src/common/entities/agent.entity';
import { Profile } from '../profile/profile.entity';

@Entity()
export class Organization extends Agent {
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

  @OneToOne(() => Profile, (profile) => profile.organization)
  @JoinColumn()
  profile: Profile;
}
