import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entity/admin.entity';
import type { AdminRepository } from 'src/core/repository/admin.repository';
import { BaseService } from 'src/infrastucture/base/base.service';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { config } from 'src/config';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { successRes } from 'src/infrastucture/response/succes';
import { TokenService } from 'src/common/token/token';
import { IToken } from 'src/common/interface/token.interface';
import { Response } from 'express';

@Injectable()
export class AdminService
  extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }

  async onModuleInit(): Promise<void> {
    try {
      const existsSuperadmin = await this.adminRepo.findOne({
        where: { role: AccessRoles.SUPERADMIN },
      });

      if (!existsSuperadmin) {
        const hashedPassword = await this.crypto.encrypt(config.ADMIN_PASSWORD);

        const superadmin = this.adminRepo.create({
          username: config.ADMIN_USERNAME,
          email: config.ADMIN_EMAIL,           
          full_name: config.ADMIN_FULLNAME,    
          hashed_password: hashedPassword,
          role: AccessRoles.SUPERADMIN,
          is_active: true,
        });

        await this.adminRepo.save(superadmin);
        console.log('Super admin created successfully');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Error on creating super admin: ' + error.message,
      );
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { username, password, email, full_name } = createAdminDto;

    const existsUsername = await this.adminRepo.findOne({ where: { username } });
    if (existsUsername) throw new ConflictException('Username already exists');

    const existsEmail = await this.adminRepo.findOne({ where: { email } });
    if (existsEmail) throw new ConflictException('Email already exists');

    const hashedPassword = await this.crypto.encrypt(password);

    const newAdmin = this.adminRepo.create({
      username,
      email,
      full_name,
      hashed_password: hashedPassword,
      role: AccessRoles.ADMIN,
      is_active: true,
    });

    await this.adminRepo.save(newAdmin);
    return successRes(newAdmin, 201);
  }

  async signIn(signInDto: CreateAdminDto, res: Response) {
    const { username, password } = signInDto;
    const admin = await this.adminRepo.findOne({ where: { username } });

    if (!admin) throw new BadRequestException('Username or password incorrect');

    const isMatchPassword = await this.crypto.decrypt(
      password,
      admin.hashed_password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('Username or password incorrect');
    }

    const payload: IToken = {
      id: admin.id,
      isActive: admin.is_active,
      role: admin.role,
    };

    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);

    await this.tokenService.writeCookie(res, 'adminToken', refreshToken, 15);

    return successRes({ token: accessToken });
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto, user: IToken) {
    const { username, password, is_active, email, full_name } = updateAdminDto;

    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (username) {
      const existsUsername = await this.adminRepo.findOne({ where: { username } });
      if (existsUsername && existsUsername.id !== id) {
        throw new ConflictException('Username already exists');
      }
    }

    if (email) {
      const existsEmail = await this.adminRepo.findOne({ where: { email } });
      if (existsEmail && existsEmail.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    let hashedPassword = admin.hashed_password;
    let isActive = admin.is_active;

    if (user.role === AccessRoles.SUPERADMIN) {
      if (password) {
        hashedPassword = await this.crypto.encrypt(password);
      }
      if (is_active !== undefined) {
        isActive = is_active;
      }
    }

    await this.adminRepo.update(
      { id },
      {
        username,
        email,
        full_name,
        is_active: isActive,
        hashed_password: hashedPassword,
      },
    );

    return this.findOneById(+id);
  }
}
