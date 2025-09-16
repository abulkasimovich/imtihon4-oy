import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { User } from './users.entity';
import { Book } from './book.entity';

export enum HistoryAction {
  BORROW = 'borrow',
  RETURN = 'return',
}

@Entity('book_histories')
export class BookHistory extends BaseEntity {
  @ManyToOne(() => Book, (book) => book.histories, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => User, (user) => user.histories, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: HistoryAction })
  action: HistoryAction;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrow_date: Date;
}
