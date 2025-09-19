import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/core/entity/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BaseService } from 'src/infrastucture/base/base.service';
import { IResponse } from 'src/common/interface/response.interface';
import { getSuccessRes } from 'src/common/util/get-succes-res';

@Injectable()
export class BookService extends BaseService<
  CreateBookDto,
  UpdateBookDto,
  Book
> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {
    super(bookRepo);
  }

  async create(dto: CreateBookDto): Promise<IResponse> {
    const entity = this.bookRepo.create(dto);
    await this.bookRepo.save(entity);

    return getSuccessRes(entity, 201);
  }

  async findAllBookFilter(filters: any) {
    let query = this.bookRepo.createQueryBuilder('book');

    if (filters.title) {
      query = query.andWhere('book.title ILIKE :title', {
        title: `%${filters.title}%`,
      });
    }

    if (filters.author) {
      query = query.andWhere('book.author ILIKE :author', {
        author: `%${filters.author}%`,
      });
    }

    if (filters.year) {
      query = query.andWhere('book.year = :year', {
        year: filters.year,
      });
    }

    if (filters.available !== undefined) {
      query = query.andWhere('book.available = :available', {
        available: filters.available === 'true',
      });
    }

    return query.getMany();
  }

  async updateBook(id: string, dto: UpdateBookDto): Promise<IResponse> {
    const entity = await this.bookRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Book not found');

    Object.assign(entity, dto);
    await this.bookRepo.save(entity);

    return getSuccessRes(entity);
  }
}
