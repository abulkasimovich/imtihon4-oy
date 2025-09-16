import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/core/entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { TokenService } from 'src/common/token/token';
import { SignInDto } from 'src/common/dto/signIn.dto';
import { Response } from 'express';
import { IToken } from 'src/common/interface/token.interface';
import { getSuccessRes } from 'src/common/util/get-succes-res';
import { BaseService } from 'src/infrastucture/base/base.service';

@Injectable()
export class UserService extends BaseService<CreateUserDto, UpdateUserDto, User>{
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(userRepo); 
  }

  async register(dto: CreateUserDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashedPassword = await this.crypto.encrypt(dto.password);
    const newUser = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepo.save(newUser);
    return getSuccessRes(newUser, 201);
  }

  async signIn(dto: SignInDto, res: Response) {
    const user = await this.userRepo.findOne({
      where: { email: dto.username },
    });
    if (!user) throw new BadRequestException('User not found');

    const match = await this.crypto.decrypt(dto.password, user?.password || '');
    if (!match) throw new BadRequestException('Invalid password');

    const payload: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    };

    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);

    await this.tokenService.writeCookie(res, 'userToken', refreshToken, 15);
    return getSuccessRes({ token: accessToken });
  }

  async updateUser(id: number, dto: UpdateUserDto, user: IToken) {
    const entity = await this.userRepo.findOne({ where: { id: id as any } });
    if (!entity) throw new NotFoundException('User not found');

    if (dto.password) {
      entity.password = await this.crypto.encrypt(dto.password);
    }
    if (dto.full_name) entity.full_name = dto.full_name;
    if (dto.role && user.role === 'SuperAdmin') {
      entity.role = dto.role;
    }
    if (dto.isActive !== undefined && user.role === 'SuperAdmin') {
      entity.isActive = dto.isActive;
    }

    await this.userRepo.save(entity);
    return getSuccessRes(entity);
  }

  async deleteUser(id: number, user: IToken) {
    if (user.role !== 'SuperAdmin' && user.role !== 'Admin') {
      throw new BadRequestException('Access denied');
    }

    const entity = await this.userRepo.findOne({ where: { id: id as any } });
    if (!entity) throw new NotFoundException('User not found');

    await this.userRepo.delete(id);
    return getSuccessRes({ message: 'User deleted' });
  }
}
