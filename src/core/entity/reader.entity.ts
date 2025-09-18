import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { Borrow } from 'src/core/entity/borrow.entity';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { AccessRoles } from 'src/common/enum/roles.enum';

@Entity('readers')
export class ReaderEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  hashed_password: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'enum', enum: AccessRoles, default: AccessRoles.READER })
  role: AccessRoles;

  @OneToMany(() => Borrow, (borrow) => borrow.reader)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (h) => h.bookId)
  bookHistories: BookHistory[];
}
