import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/infrastucture/decorator/role.decorator';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { IResponse } from 'src/common/interface/response.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookService } from './book.service';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Create new Book' })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  create(@Body() dto: CreateBookDto): Promise<IResponse> {
    return this.bookService.create(dto);
  }

  @Patch(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Update Book by id' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
  ): Promise<IResponse> {
    return this.bookService.update(id, dto);
  }

  @Get()
  async getBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('year') year?: number,
    @Query('available') available?: boolean,
  ) {
    return this.bookService.findAllBookFilter({ title, author, year, available });
  }

  @Get(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Get Book by id' })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<IResponse> {
    return this.bookService.findOneById(id);
  }

  @Delete(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Delete Book by id' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<IResponse> {
    return this.bookService.delete(id);
  }
}
