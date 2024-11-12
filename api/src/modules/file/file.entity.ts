import BaseAuditEntity from 'src/common/database/base-audit.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class File extends BaseAuditEntity {
  @Column()
  public filename: string;

  @Column()
  public path: string;

  @Column({ nullable: true })
  public mimetype: string;
}
