import BaseAuditEntity from 'src/common/database/base-audit.entity';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { Profile } from 'src/modules/profile/profile.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
class User extends BaseAuditEntity {
  @Column({
    type: 'varchar',
    length: 100,
    default: VerificationStatus.UNVERIFIED,
  })
  status: VerificationStatus;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ unique: true, nullable: true })
  public username: string;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public profile: Profile;
}

export default User;
