import { Repository } from 'typeorm';
import { LibrarianEntity } from '../entity/librarian.entity';

export type LibrarianRepository = Repository<LibrarianEntity>;
