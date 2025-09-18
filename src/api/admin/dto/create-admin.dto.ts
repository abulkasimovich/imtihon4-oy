import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    type: 'string',
    description: 'Username for admin',
    example: 'Ali',
  })
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'email for admin',
    example: 'Ali123@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Full_name for admin',
    example: 'Ali Valiyev',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    type: 'string',
    description: 'Password for admin',
    example: 'Ali1234!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
