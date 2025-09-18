import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateLibrarianDto {
  @ApiProperty({ example: 'Rustam Akmalov' })
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'rustam@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Str0ngP@ssw0rd!' })
  @MinLength(6)
  password: string;
}
