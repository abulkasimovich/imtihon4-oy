import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { User } from './users.entity';
import { Book } from './book.entity';

@Entity('borrows')
export class Borrow extends BaseEntity {
  @ManyToOne(() => User, (user) => user.borrows, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: 'CASCADE' })
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrow_date: Date;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  return_date: Date;

  @Column({ type: 'boolean', default: false })
  overdue: boolean;

  @ManyToOne(() => User, (user) => user.borrows, { eager: true })
  users: User;
}
