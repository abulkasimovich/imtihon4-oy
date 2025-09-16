import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { Borrow } from './borrow.entity';
import { BookHistory } from './book-history.entity';

@Entity('books')
export class Book extends BaseEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'int', nullable: true })
  published_year: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (history) => history.book)
  histories: BookHistory[];
}
