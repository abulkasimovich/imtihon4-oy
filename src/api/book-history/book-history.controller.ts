import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Get,
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
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';
import { BookHistoryService } from './book-history.service';

@ApiTags('Book-History')
@ApiBearerAuth()
@Controller('book-history')
export class BookHistoryController {
  constructor(private readonly bookHistoryService: BookHistoryService) {}

  @Post()
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Create BookHistory (reader_id, book_id)' })
  @ApiResponse({ status: 201, description: 'BookHistory created successfully' })
  create(@Body() dto: CreateBookHistoryDto): Promise<IResponse> {
    return this.bookHistoryService.create(dto);
  }

  @Patch(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Update BookHistory by id' })
  @ApiResponse({ status: 200, description: 'BookHistory updated successfully' })
  updateBookHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookHistoryDto,
  ): Promise<IResponse> {
    return this.bookHistoryService.update(id, dto);
  }

  @Get(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Get BookHistory by id' })
  @ApiResponse({
    status: 200,
    description: 'BookHistory retrieved successfully',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<IResponse> {
    return this.bookHistoryService.findOneById(id);
  }

  @Get()
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Get BookHistory by id' })
  @ApiResponse({
    status: 200,
    description: 'BookHistories retrieved successfully',
  })
  findAll(){
    return this.bookHistoryService.findAll();
  }

  @Delete(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Delete BookHistory by id' })
  @ApiResponse({ status: 200, description: 'BookHistory deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: string): Promise<IResponse> {
    return this.bookHistoryService.delete(id);
  }
}
