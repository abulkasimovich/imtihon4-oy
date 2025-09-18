import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from 'src/core/entity/borrow.entity';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import { Book } from 'src/core/entity/book.entity';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { TokenService } from 'src/common/token/token';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow, ReaderEntity, Book])],
  controllers: [BorrowController],
  providers: [BorrowService, CryptoService, TokenService],
})
export class BorrowModule {}
