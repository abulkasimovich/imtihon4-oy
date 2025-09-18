import { Repository } from 'typeorm';
import { AdminEntity } from 'src/core/entity/admin.entity';

export type AdminRepository = Repository<AdminEntity>;
