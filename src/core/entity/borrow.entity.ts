import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import { Book } from 'src/core/entity/book.entity';

@Entity('borrow')
export class Borrow extends BaseEntity {
  @ManyToOne(() => ReaderEntity, (reader) => reader.borrows, { onDelete: 'CASCADE' })
  reader: ReaderEntity;;

  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: 'CASCADE' })
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date;

  @Column({ default: false })
  overdue: boolean;
}
