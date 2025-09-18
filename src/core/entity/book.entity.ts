import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { Borrow } from 'src/core/entity/borrow.entity';

@Entity('books')
export class Book extends BaseEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ default: true })
  available: boolean;

  @OneToMany(() => BookHistory, (bookHistory) => bookHistory.bookId, {
    cascade: true,
  })
  bookHistories: BookHistory[];

  @OneToMany(() => Borrow, (borrow) => borrow.book, {
    cascade: true,
  })
  borrows: Borrow[];
}
