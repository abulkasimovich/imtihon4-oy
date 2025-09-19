import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReaderService } from './reader.service';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import type { Response } from 'express';
import { CookieGetter } from 'src/infrastucture/decorator/get-cookie.decorator';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/infrastucture/decorator/role.decorator';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { GetRequestUser } from 'src/infrastucture/decorator/get-request-user.decorator';
import type { IToken } from 'src/common/interface/token.interface';

@ApiTags('Reader')
@Controller('readers')
export class ReaderController {
  constructor(
    private readonly readerService: ReaderService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Sign up reader' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Reader created' })
  @Post('signup')
  signUp(@Body() dto: CreateReaderDto) {
    return this.readerService.createReader(dto);
  }

  @ApiOperation({ summary: 'Sign in reader' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reader signed in' })
  @Post('signin')
  signIn(
    @Body() dto: CreateReaderDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.readerService.signIn(dto, res);
  }

  @ApiOperation({ summary: 'Sign out reader' })
  @Post('signout')
  signOut(
    @CookieGetter('readerToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.readerService.getRepository,
      token,
      res,
      'readerToken',
    );
  }

  @ApiOperation({ summary: 'Get reader by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.READER, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.readerService.findOneById(+id, {
      where: { is_deleted: false },
    });
  }

  @ApiOperation({ summary: 'Update reader by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.READER, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @GetRequestUser('user') user: IToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReaderDto,
  ) {
    return this.readerService.updateReader(id, dto, user);
  }

  @ApiOperation({ summary: 'Delete reader by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.readerService.delete(id);
  }
}
