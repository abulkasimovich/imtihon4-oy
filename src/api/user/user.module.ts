import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core/entity/users.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenService } from 'src/common/token/token'; 
import { CryptoService } from 'src/common/bcrypt/Crypto';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [UserService, TokenService, CryptoService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
