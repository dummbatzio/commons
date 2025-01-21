import Agent from 'src/common/entities/agent.entity';
import { OrganizationMember } from 'src/modules/organization/organization-member.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Assignment } from '../task/assignment.entity';

@Entity()
class User extends Agent {
  @Column({ unique: true })
  public email: string;

  @Column({ unique: true, nullable: true })
  public username: string;

  @Column()
  public password: string;

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
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  memberships: OrganizationMember[];

  @OneToMany(() => Assignment, (assignment) => assignment.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  assignments: Assignment[];
}

export default User;
