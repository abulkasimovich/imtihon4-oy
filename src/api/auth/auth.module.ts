import { forwardRef, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { TokenService } from 'src/common/token/token';

import { CryptoService } from 'src/common/bcrypt/Crypto';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [forwardRef(() => AdminModule), CacheModule.register({
      ttl: 60 * 5, 
      max: 100,    
    }), ],
  providers: [AuthService, TokenService, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
