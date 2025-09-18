import { Repository } from 'typeorm';
import { ReaderEntity } from '../entity/reader.entity';

export type ReaderRepository = Repository<ReaderEntity>;
