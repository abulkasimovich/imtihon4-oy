import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config/index';
import { JwtModule } from '@nestjs/jwt';
import { BookModule } from '../api/book/book.module';
import { BookHistoryModule } from '../api/book-history/book-history.module';
import { BorrowModule } from './borrow/borrow.module';
import { AdminModule } from 'src/api/admin/admin.module';
import { LibrarianModule } from './librarian/librarian.module';
import { ReaderModule } from './reader/reader.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: String(config.DB_URI),
      autoLoadEntities: true,
      synchronize: true,
    }),

    JwtModule.register({
      global: true,
    }),
    AdminModule,
    LibrarianModule,
    ReaderModule,
    BookModule,
    BookHistoryModule,
    BorrowModule,
  ],
})
export class AppModule {}
