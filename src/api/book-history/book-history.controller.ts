import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookHistoryService } from './book-history.service';
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';

@ApiTags('BookHistory')
@Controller('book-history')
export class BookHistoryController {
  constructor(private readonly bookHistoryService: BookHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create new book history record' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        id: 'uuid',
        userId: 'uuid',
        bookId: 'uuid',
        borrow_date: '2025-09-16T10:00:00.000Z',
        due_date: '2025-09-23T10:00:00.000Z',
        return_date: '2025-09-21T14:20:00.000Z',
        overdue: false,
      },
    },
  })
  create(@Body() dto: CreateBookHistoryDto) {
    return this.bookHistoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all book history records' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: [
        {
          id: 'uuid',
          userId: 'uuid',
          bookId: 'uuid',
          borrow_date: '2025-09-16T10:00:00.000Z',
          due_date: '2025-09-23T10:00:00.000Z',
          return_date: '2025-09-21T14:20:00.000Z',
          overdue: false,
        },
      ],
    },
  })
  findAll() {
    return this.bookHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book history record by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        userId: 'uuid',
        bookId: 'uuid',
        borrow_date: '2025-09-16T10:00:00.000Z',
        due_date: '2025-09-23T10:00:00.000Z',
        return_date: '2025-09-21T14:20:00.000Z',
        overdue: false,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.bookHistoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update book history record' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        id: 'uuid',
        userId: 'uuid',
        bookId: 'uuid',
        borrow_date: '2025-09-16T10:00:00.000Z',
        due_date: '2025-09-23T10:00:00.000Z',
        return_date: '2025-09-22T12:00:00.000Z',
        overdue: true,
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateBookHistoryDto) {
    return this.bookHistoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete book history record' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { message: 'Book history deleted successfully' } },
  })
  remove(@Param('id') id: string) {
    return this.bookHistoryService.remove(id);
  }
}
