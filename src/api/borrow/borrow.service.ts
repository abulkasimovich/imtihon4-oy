import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from 'src/core/entity/borrow.entity';
import { Book } from 'src/core/entity/book.entity';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { BaseService } from 'src/infrastucture/base/base.service';
import { IResponse } from 'src/common/interface/response.interface';
import { getSuccessRes } from 'src/common/util/get-succes-res';

@Injectable()
export class BorrowService extends BaseService<
  CreateBorrowDto,
  UpdateBorrowDto,
  Borrow
> {
  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepo: Repository<Borrow>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(ReaderEntity)
    private readonly readerRepo: Repository<ReaderEntity>,
  ) {
    super(borrowRepo);
  }

  async create(dto: CreateBorrowDto): Promise<IResponse> {
    const reader = await this.readerRepo.findOne({
      where: { id: dto.readerId },
    });
    if (!reader) throw new NotFoundException('Reader not found');

    const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const entity = this.borrowRepo.create({
      reader: { id: dto.readerId } as ReaderEntity,
      book: { id: dto.bookId } as Book,
      dueDate: dto.due_date,
    });

    await this.borrowRepo.save(entity);

    return getSuccessRes({ ...entity, reader, book }, 201);
  }

  async updateBorrow(id: string, dto: UpdateBorrowDto): Promise<IResponse> {
    const entity = await this.borrowRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Borrow not found');

    let reader: ReaderEntity | null = null;
    let book: Book | null = null;

    if (dto.readerId) {
      reader = await this.readerRepo.findOne({ where: { id: dto.readerId } });
      if (!reader) throw new NotFoundException('Reader not found');
      entity.reader = reader;
    }

    if (dto.bookId) {
      book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
      if (!book) throw new NotFoundException('Book not found');
      entity.book = book;
    }

    Object.assign(entity, dto);
    await this.borrowRepo.save(entity);

    return getSuccessRes({
      ...entity,
      reader:
        reader ??
        (await this.readerRepo.findOne({ where: { id: entity.reader.id } })),
      book:
        book ??
        (await this.bookRepo.findOne({ where: { id: entity.book.id } })),
    });
  }
}
