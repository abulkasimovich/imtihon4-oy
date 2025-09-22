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
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { BorrowService } from './borrow.service';

@ApiTags('Borrows')
@ApiBearerAuth()
@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Create Borrow (reader_id, book_id)' })
  @ApiResponse({ status: 201, description: 'Borrow created successfully' })
  create(@Body() dto: CreateBorrowDto): Promise<IResponse> {
    return this.borrowService.create(dto);
  }

  @Patch(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Update Borrow by id' })
  @ApiResponse({ status: 200, description: 'Borrow updated successfully' })
  updateBorrow(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBorrowDto,
  ): Promise<IResponse> {
    return this.borrowService.update(id, dto);
  }

  @Get(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Get Borrow by id' })
  @ApiResponse({ status: 200, description: 'Borrow retrieved successfully' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<IResponse> {
    return this.borrowService.findOneById(id);
  }

  @Get()
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Get all Borrows ' })
  @ApiResponse({ status: 200, description: 'Borrows retrieved successfully' })
  findAll() {
    return this.borrowService.findAll();
  }

  @Delete(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN)
  @ApiOperation({ summary: 'Delete Borrow by id' })
  @ApiResponse({ status: 200, description: 'Borrow deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: string): Promise<IResponse> {
    return this.borrowService.delete(id);
  }
}
