import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { BookHistoryService } from './book-history.service';
import { BookHistoryController } from './book-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookHistory])],
  providers: [BookHistoryService],
  controllers: [BookHistoryController],
  exports: [BookHistoryService],
})
export class BookHistoryModule {}
