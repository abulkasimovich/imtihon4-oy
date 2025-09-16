import { Repository } from 'typeorm';
import { Borrow } from 'src/core/entity/borrow.entity';

export type BorrowRepository = Repository<Borrow>;
