import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import type { ReaderRepository } from 'src/core/repository/reader.repository';
import { BaseService } from 'src/infrastucture/base/base.service';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { config } from 'src/config';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { successRes } from 'src/infrastucture/response/succes';
import { TokenService } from 'src/common/token/token';
import { IToken } from 'src/common/interface/token.interface';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { Response } from 'express';

@Injectable()
export class ReaderService extends BaseService<
  CreateReaderDto,
  UpdateReaderDto,
  ReaderEntity
> {
  constructor(
    @InjectRepository(ReaderEntity)
    private readonly readerRepo: ReaderRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(readerRepo);
  }

  async onModuleInit(): Promise<void> {
    try {
      const existsReader = await this.readerRepo.findOne({
        where: { role: AccessRoles.READER },
      });
      if (!existsReader) {
        const hashedPassword = await this.crypto.encrypt(
          config.READER_PASSWORD,
        );
        const reader = this.readerRepo.create({
          email: config.READER_EMAIL,
          hashed_password: hashedPassword,
          role: AccessRoles.READER,
          full_name: config.READER_FULLNAME,
        });
        await this.readerRepo.save(reader);
        console.log('Reader created successfully');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error on creating reader');
    }
  }

  async createReader(createDto: CreateReaderDto) {
    const { full_name, password } = createDto;
    const exists = await this.readerRepo.findOne({ where: { full_name } });
    if (exists) throw new ConflictException('full_name already exists');

    const hashed = await this.crypto.encrypt(password);
    const newReader = this.readerRepo.create({
      full_name,
      hashed_password: hashed,
      role: AccessRoles.READER,
    });
    await this.readerRepo.save(newReader);
    return successRes(newReader, 201);
  }

  async signIn(createDto: CreateReaderDto, res: Response) {
    const { full_name, password } = createDto;
    const reader = await this.readerRepo.findOne({ where: { full_name } });
    const isMatch = await this.crypto.decrypt(
      password,
      reader?.hashed_password || '',
    );
    if (!reader || !isMatch)
      throw new BadRequestException('full_name or password incorrect');

    const payload: IToken = {
      id: reader.id,
      isActive: reader.is_active,
      role: reader.role,
    };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'readerToken', refreshToken, 15);
    return successRes({ token: accessToken });
  }

  async updateReader(id: string, dto: UpdateReaderDto, user: IToken) {
    const { full_name, password, is_active } = dto;
    const reader = await this.readerRepo.findOne({ where: { id } });
    if (!reader) throw new NotFoundException('Reader not found');

    if (full_name) {
      const exists = await this.readerRepo.findOne({ where: { full_name } });
      if (exists && exists.id !== id) {
        throw new ConflictException('full_name already exists');
      }
    }

    let hashed = reader.hashed_password;
    if (password) hashed = await this.crypto.encrypt(password);

    await this.readerRepo.update(
      { id },
      {
        full_name,
        is_active: is_active ?? reader.is_active,
        hashed_password: hashed,
      },
    );
    return this.findOneById(+id);
  }
}
