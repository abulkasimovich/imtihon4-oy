import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/core/entity/book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { TokenService } from 'src/common/token/token';

@Module({
  imports: [TypeOrmModule.forFeature([Book, ReaderEntity])],
  controllers: [BookController],
  providers: [BookService, CryptoService, TokenService],
})
export class BookModule {}
