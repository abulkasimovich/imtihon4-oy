import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from '../../infrastucture/decorator/role.decorator';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { SignInDto } from 'src/common/dto/signIn.dto';
import type { Response } from 'express';
import { CookieGetter } from 'src/infrastucture/decorator/get-cookie.decorator';
import { AuthService } from '../auth/auth.service';
import { GetRequestUser } from 'src/infrastucture/decorator/get-request-user.decorator';
import type { IToken } from 'src/common/interface/token.interface';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ILike, Repository } from 'typeorm';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entity/users.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: { id: 1, email: 'test@mail.com', full_name: 'Test User' },
    },
  })
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'User login (get tokens)' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        accessToken: 'jwt_token_here',
        refreshToken: 'refresh_token_here',
      },
    },
  })
  signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.userService.signIn(dto, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
  @Get('pagination')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users with pagination' })
  findAllWithPagination(@Query() queryDto: QueryPaginationDto) {
    const { query, page, limit } = queryDto;
    const where = query
      ? { full_name: ILike(`%${query}%`), isActive: true }
      : { isActive: true };

    return this.userService.findAllWithPagination({
      where,
      order: { createdAt: 'DESC' },
      select: { id: true, full_name: true, email: true, isActive: true },
      skip: page,
      take: limit,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Post('token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get new access token via refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { example: { accessToken: 'new_access_token' } },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      example: { message: 'Invalid refresh token', error: 'Unauthorized' },
    },
  })
  newToken(@CookieGetter('userToken') token: string) {
    return this.authService.newToken(this.userService.getRepository, token);
  }

  @Post('signout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out user' })
  signOut(
    @CookieGetter('userToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.userService.getRepository,
      token,
      res,
      'userToken',
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.userService.update(+id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hard delete user by ID' })
  remove(@Param('id') id: string, @GetRequestUser('user') user: IToken) {
    return this.userService.delete(+id);
  }
  
}
