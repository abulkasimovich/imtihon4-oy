import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { IToken } from 'src/common/interface/token.interface';
import { TokenService } from 'src/common/token/token';
import { getSuccessRes } from 'src/common/util/get-succes-res';
import { config } from 'src/config';
import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: TokenService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async newToken(repository: Repository<any>, token: string) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.REFRESH_TOKEN_SECRET_KEY,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await repository.findOne({ where: { id: data?.id } });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    const paylod: IToken = {
      id: user.id,
      isActive: user.isActive,
      role: user.roles,
    };
    const accessToken = await this.jwt.accessToken(paylod);
    return getSuccessRes({ token: accessToken });
  }

  async signOut(
    repository: Repository<any>,
    token: string,
    res: Response,
    tokenKey: string,
  ) {
    const data: any = await this.jwt.verifyToken(
      token,
      config.ACCESS_TOKEN_SECRET_KEY,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await repository.findOne({ where: { id: data?.id } });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    res.clearCookie(tokenKey);
    return getSuccessRes({});
  }

  async saveOtp(email: string, otp: string) {
    await this.cacheManager.set(`otp:${email}`, otp, 1000 * 60 * 5);
    return { message: 'OTP saqlandi' };
  }

  async verifyOtp(email: string, otp: string) {
    const savedOtp = await this.cacheManager.get<string>(`otp:${email}`);
    if (!savedOtp) throw new BadRequestException('OTP expired');
    if (savedOtp !== otp) throw new BadRequestException('OPT incorrect');

    await this.cacheManager.del(`otp:${email}`);
    return true;
  }

  async resetPassword(
    repository: Repository<any>,
    email: string,
    newPassword: string,
  ) {
    const user = await repository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await repository.save(user);

    return { message: 'password successfully changed' };
  }
}
