import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { AccessRoles } from 'src/common/enum/roles.enum';

@Entity('librarians')
export class LibrarianEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar' })
  hashed_password: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'enum', enum: AccessRoles, default: AccessRoles.LIBRARIAN })
  role: AccessRoles;
}
