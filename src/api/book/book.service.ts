import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/core/entity/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  create(dto: CreateBookDto) {
    const book = this.bookRepo.create(dto);
    return this.bookRepo.save(book);
  }

  findAll() {
    return this.bookRepo.find();
  }

  async findOne(id: string) {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.bookRepo.save(book);
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    return this.bookRepo.remove(book);
  }
}
