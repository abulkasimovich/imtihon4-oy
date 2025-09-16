import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { Borrow } from './borrow.entity';
import { BookHistory } from './book-history.entity';
import { AccessRoles } from 'src/common/enum/roles.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: AccessRoles, default: AccessRoles.READER })
  role: AccessRoles;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (history) => history.user)
  histories: BookHistory[];
}
