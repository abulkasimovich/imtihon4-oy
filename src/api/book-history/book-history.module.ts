import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import { Book } from 'src/core/entity/book.entity';
import { BookHistoryService } from './book-history.service';
import { BookHistoryController } from './book-history.controller';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { TokenService } from 'src/common/token/token';

@Module({
  imports: [TypeOrmModule.forFeature([BookHistory, ReaderEntity, Book])],
  controllers: [BookHistoryController],
  providers: [BookHistoryService, CryptoService, TokenService],
})
export class BookHistoryModule {}
