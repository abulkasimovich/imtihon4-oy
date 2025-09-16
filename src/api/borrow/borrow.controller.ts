import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Borrow')
@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({
    status: 201,
    description: 'Book borrowed successfully',
    schema: {
      example: {
        id: 'uuid',
        userId: 'uuid',
        bookId: 'uuid',
        borrow_date: '2025-09-16T10:00:00.000Z',
        due_date: '2025-09-23T10:00:00.000Z',
        return_date: null,
        overdue: false,
      },
    },
  })
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.createBorrow(createBorrowDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all borrowed books' })
  findAll() {
    return this.borrowService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get borrow by ID' })
  findOne(@Param('id') id: string) {
    return this.borrowService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update borrow by ID' })
  update(@Param('id') id: string, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowService.updateBorrow(id, updateBorrowDto);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a borrowed book' })
  returnBook(@Param('id') id: string) {
    return this.borrowService.returnBook(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete borrow by ID' })
  remove(@Param('id') id: string) {
    return this.borrowService.deleteBorrow(id);
  }
}
