import { Module } from '@nestjs/common';
import { LibrarianService } from './librarian.service';
import { LibrarianController } from './librarian.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrarianEntity } from 'src/core/entity/librarian.entity';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { TokenService } from 'src/common/token/token';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LibrarianEntity]), AuthModule],
  controllers: [LibrarianController],
  providers: [LibrarianService, CryptoService, TokenService],
})
export class LibrarianModule {}
