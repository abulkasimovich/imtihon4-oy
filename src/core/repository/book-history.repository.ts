import { Repository } from 'typeorm';
import { BookHistory } from '../entity/book-history.entity';

export type BookHistoryRepository = Repository<BookHistory>;
