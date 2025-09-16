import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from 'src/core/entity/borrow.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { Book } from 'src/core/entity/book.entity';
import { getSuccessRes } from 'src/common/util/get-succes-res';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepo: Repository<Borrow>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async createBorrow(createBorrowDto: CreateBorrowDto) {
    const book = await this.bookRepo.findOne({
      where: { id: createBorrowDto.bookId },
    });
    if (!book) throw new NotFoundException('Book not found');
    if (!book.available) {
      throw new BadRequestException('Book is not available to borrow');
    }

    // Kitobni mavjud emas qilib qo‘yamiz
    book.available = false;
    await this.bookRepo.save(book);

    const borrow = this.borrowRepo.create(createBorrowDto);
    await this.borrowRepo.save(borrow);
    return getSuccessRes(borrow, 201);
  }

  async findAll() {
    return this.borrowRepo.find({ relations: ['user', 'book'] });
  }

  async findOneById(id: string) {
    const borrow = await this.borrowRepo.findOne({
      where: { id },
      relations: ['user', 'book'],
    });
    if (!borrow) throw new NotFoundException('Borrow not found');
    return borrow;
  }

  async updateBorrow(id: string, updateBorrowDto: UpdateBorrowDto) {
    const borrow = await this.findOneById(id);
    Object.assign(borrow, updateBorrowDto);
    await this.borrowRepo.save(borrow);
    return getSuccessRes(borrow);
  }

  async returnBook(id: string) {
  const borrow = await this.findOneById(id);
  if (borrow.return_date) {
    throw new BadRequestException('Book already returned');
  }

  borrow.return_date = new Date();
  borrow.overdue = borrow.return_date > borrow.due_date;

  if (borrow.book) {
    borrow.book.available = true;
    await this.bookRepo.save(borrow.book);
  }

  await this.borrowRepo.save(borrow);
  return getSuccessRes(borrow);
}


  async deleteBorrow(id: string) {
    const borrow = await this.findOneById(id);
    await this.borrowRepo.remove(borrow);
    return getSuccessRes({ message: 'Borrow deleted successfully' });
  }
}
