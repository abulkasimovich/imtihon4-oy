import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashed_password: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ default: 'admin' })
  role: string;

  @Column()
  full_name: string;
}
