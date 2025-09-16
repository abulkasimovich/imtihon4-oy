import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookHistory } from 'src/core/entity/book-history.entity';
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';

@Injectable()
export class BookHistoryService {
  constructor(
    @InjectRepository(BookHistory)
    private readonly bookHistoryRepo: Repository<BookHistory>,
  ) {}

  async create(dto: CreateBookHistoryDto) {
    const bookHistory = this.bookHistoryRepo.create(dto);
    return await this.bookHistoryRepo.save(bookHistory);
  }

  async findAll() {
    return await this.bookHistoryRepo.find({
      relations: ['user', 'book'],
      order: { borrow_date: 'DESC' },
    });
  }

  async findOne(id: string) {
    const bookHistory = await this.bookHistoryRepo.findOne({
      where: { id },
      relations: ['user', 'book'],
    });

    if (!bookHistory) {
      throw new NotFoundException(`BookHistory with ID ${id} not found`);
    }

    return bookHistory;
  }

  async update(id: string, dto: UpdateBookHistoryDto) {
    const bookHistory = await this.findOne(id);

    const updated = Object.assign(bookHistory, dto);
    return await this.bookHistoryRepo.save(updated);
  }

  async remove(id: string) {
    const bookHistory = await this.findOne(id);
    await this.bookHistoryRepo.remove(bookHistory);
    return { message: 'Book history deleted successfully' };
  }
}
