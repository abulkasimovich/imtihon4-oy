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
import { LibrarianService } from './librarian.service';
import { CreateLibrarianDto } from './dto/create-librarian.dto';
import { UpdateLibrarianDto } from './dto/update-librarian.dto';
import type { Response } from 'express';
import { CookieGetter } from 'src/infrastucture/decorator/get-cookie.decorator';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/infrastucture/decorator/role.decorator';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { GetRequestUser } from 'src/infrastucture/decorator/get-request-user.decorator';
import type { IToken } from 'src/common/interface/token.interface';

@ApiTags('Librarian')
@Controller('librarians')
export class LibrarianController {
  constructor(
    private readonly librarianService: LibrarianService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Sign up librarian' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Librarian created' })
  @Post('signup')
  signUp(@Body() dto: CreateLibrarianDto) {
    return this.librarianService.createLibrarian(dto);
  }

  @ApiOperation({ summary: 'Sign in librarian' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Librarian signed in' })
  @Post('signin')
  signIn(
    @Body() dto: CreateLibrarianDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.librarianService.signIn(dto, res);
  }

  @ApiOperation({ summary: 'Get new access token' })
  @Post('token')
  newToken(@CookieGetter('librarianToken') token: string) {
    return this.authService.newToken(
      this.librarianService.getRepository,
      token,
    );
  }

  @ApiOperation({ summary: 'Sign out librarian' })
  @Post('signout')
  signOut(
    @CookieGetter('librarianToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.librarianService.getRepository,
      token,
      res,
      'librarianToken',
    );
  }

  @ApiOperation({ summary: 'Get librarian by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.librarianService.findOneById(+id, {
      where: { is_deleted: false },
    });
  }

  @ApiOperation({ summary: 'Update librarian by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN, AccessRoles.LIBRARIAN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @GetRequestUser('user') user: IToken,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLibrarianDto,
  ) {
    return this.librarianService.updateLibrarian(id, dto, user);
  }
  
  @ApiOperation({ summary: 'Delete librarian by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.librarianService.delete(id);
  }
}
