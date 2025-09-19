import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateReaderDto {
  @ApiProperty({ example: 'Rustam Akmalov' })
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'rustam@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Rustam123!' })
  @MinLength(6)
  password: string;
}
