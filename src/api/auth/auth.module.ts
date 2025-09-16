import { forwardRef, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { TokenService } from 'src/common/token/token';

import { CryptoService } from 'src/common/bcrypt/Crypto';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule), CacheModule.register({
      ttl: 60 * 5, 
      max: 100,    
    }), ],
  providers: [AuthService, TokenService, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
