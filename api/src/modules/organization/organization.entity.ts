import { Column, Entity, OneToMany } from 'typeorm';
import { OrganizationMember } from './organization-member.entity';
import Agent from 'src/common/entities/agent.entity';

@Entity()
export class Organization extends Agent {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.organization,
  )
  public members: OrganizationMember[];
}
