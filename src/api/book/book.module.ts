import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/core/entity/book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Borrow } from 'src/core/entity/borrow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Borrow])],
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
