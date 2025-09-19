import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibrarianEntity } from 'src/core/entity/librarian.entity';
import type { LibrarianRepository } from 'src/core/repository/librarian.repository';
import { BaseService } from 'src/infrastucture/base/base.service';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { config } from 'src/config';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { successRes } from 'src/infrastucture/response/succes';
import { TokenService } from 'src/common/token/token';
import { IToken } from 'src/common/interface/token.interface';
import { CreateLibrarianDto } from './dto/create-librarian.dto';
import { UpdateLibrarianDto } from './dto/update-librarian.dto';
import { Response } from 'express';

@Injectable()
export class LibrarianService extends BaseService<
  CreateLibrarianDto,
  UpdateLibrarianDto,
  LibrarianEntity
> {
  constructor(
    @InjectRepository(LibrarianEntity)
    private readonly librarianRepo: LibrarianRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(librarianRepo);
  }

  async onModuleInit(): Promise<void> {
    try {
      const existsLibrarian = await this.librarianRepo.findOne({
        where: { role: AccessRoles.LIBRARIAN },
      });
      if (!existsLibrarian) {
        const hashedPassword = await this.crypto.encrypt(
          config.LIBRARIAN_PASSWORD,
        );
        const librarian = this.librarianRepo.create({
          email: config.LIBRARIAN_EMAIL,
          hashed_password: hashedPassword,
          role: AccessRoles.LIBRARIAN,
          full_name: config.LIBRARIAN_FULLNAME,
        });
        await this.librarianRepo.save(librarian);
        console.log('Librarian created successfully');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error on creating librarian');
    }
  }

  async createLibrarian(createDto: CreateLibrarianDto) {
  const { full_name, password, email } = createDto;

  const exists = await this.librarianRepo.findOne({ where: { full_name } });
  if (exists) throw new ConflictException('full_name already exists');

  const hashed = await this.crypto.encrypt(password);

  const newLibrarian = this.librarianRepo.create({
    full_name,
    email,
    hashed_password: hashed,
    role: AccessRoles.LIBRARIAN,
  });

  await this.librarianRepo.save(newLibrarian);
  return successRes(newLibrarian, 201);
}


  async signIn(createDto: CreateLibrarianDto, res: Response) {
    const { full_name, password } = createDto;
    const librarian = await this.librarianRepo.findOne({
      where: { full_name },
    });
    const isMatch = await this.crypto.decrypt(
      password,
      librarian?.hashed_password || '',
    );
    if (!librarian || !isMatch)
      throw new BadRequestException('full_name or password incorrect');

    const payload: IToken = {
      id: librarian.id,
      isActive: librarian.is_active,
      role: librarian.role,
    };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(
      res,
      'librarianToken',
      refreshToken,
      15,
    );
    return successRes({ token: accessToken });
  }

  async updateLibrarian(id: string, dto: UpdateLibrarianDto, user: IToken) {
    const { full_name, password, is_active } = dto;
    const librarian = await this.librarianRepo.findOne({ where: { id } });
    if (!librarian) throw new NotFoundException('Librarian not found');

    if (full_name) {
      const exists = await this.librarianRepo.findOne({ where: { full_name } });
      if (exists && exists.id !== id) {
        throw new ConflictException('full_name already exists');
      }
    }

    let hashed = librarian.hashed_password;
    if (password) hashed = await this.crypto.encrypt(password);

    await this.librarianRepo.update(
      { id },
      {
        full_name,
        is_active: is_active ?? librarian.is_active,
        hashed_password: hashed,
      },
    );
    return this.findOneById(+id);
  }
}
