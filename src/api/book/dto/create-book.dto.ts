import { IsNotEmpty, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code', description: 'Book title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Robert C. Martin', description: 'Author name' })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ example: 2008, description: 'Published year' })
  @IsInt()
  @Min(0)
  year: number;

  @ApiProperty({ example: true, description: 'Is book available?' })
  @IsBoolean()
  available: boolean;
}
