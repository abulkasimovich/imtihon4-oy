import { Module } from '@nestjs/common';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReaderEntity } from 'src/core/entity/reader.entity';
import { CryptoService } from 'src/infrastucture/crypt/Crypto';
import { TokenService } from 'src/common/token/token';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReaderEntity]), AuthModule],
  controllers: [ReaderController],
  providers: [ReaderService, CryptoService, TokenService],
})
export class ReaderModule {}
