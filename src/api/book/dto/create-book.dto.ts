import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Alisher Navoiy' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Xamsa' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  year: number;
}
