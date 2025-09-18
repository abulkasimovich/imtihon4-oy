import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { Book } from 'src/core/entity/book.entity';
import { ReaderEntity } from 'src/core/entity/reader.entity';

@Entity('book_history')
export class BookHistory extends BaseEntity {
  @ManyToOne(() => ReaderEntity, (reader) => reader.bookHistories, { onDelete: 'CASCADE' })
  readerId: string;

  @ManyToOne(() => Book, (book) => book.bookHistories, { onDelete: 'CASCADE' })
  bookId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date;

  @Column({ default: false })
  overdue: boolean;
}
