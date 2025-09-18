import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { Book } from 'src/core/entity/book.entity';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';
import { BaseService } from 'src/infrastucture/base/base.service';
import { IResponse } from 'src/common/interface/response.interface';
import { getSuccessRes } from 'src/common/util/get-succes-res';

@Injectable()
export class BookHistoryService extends BaseService<
  CreateBookHistoryDto,
  UpdateBookHistoryDto,
  BookHistory
> {
  constructor(
    @InjectRepository(BookHistory)
    private readonly historyRepo: Repository<BookHistory>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(ReaderEntity)
    private readonly readerRepo: Repository<ReaderEntity>,
  ) {
    super(historyRepo);
  }

  async create(dto: CreateBookHistoryDto): Promise<IResponse> {
    const reader = await this.readerRepo.findOne({
      where: { id: dto.readerId },
    });
    if (!reader) throw new NotFoundException('Reader not found');

    const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const entity = this.historyRepo.create({
      readerId: reader.id,
      bookId: book.id,
      borrowDate: dto.borrowedAt,
      returnDate: dto.returnedAt,
    });

    await this.historyRepo.save(entity);

    return getSuccessRes({ ...entity, reader, book }, 201);
  }

  async updateBookHistory(
    id: string,
    dto: UpdateBookHistoryDto,
  ): Promise<IResponse> {
    const entity = await this.historyRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('BookHistory not found');

    let reader: ReaderEntity | null = null;
    let book: Book | null = null;

    if (dto.readerId) {
      reader = await this.readerRepo.findOne({ where: { id: dto.readerId } });
      if (!reader) throw new NotFoundException('Reader not found');
      entity.readerId = reader.id;
    }

    if (dto.bookId) {
      book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
      if (!book) throw new NotFoundException('Book not found');
      entity.bookId = book.id;
    }

    Object.assign(entity, dto);
    await this.historyRepo.save(entity);

    return getSuccessRes({
      ...entity,
      reader:
        reader ??
        (await this.readerRepo.findOne({ where: { id: entity.readerId } })),
      book:
        book ?? (await this.bookRepo.findOne({ where: { id: entity.bookId } })),
    });
  }
}
