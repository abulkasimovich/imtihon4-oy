import { PartialType } from '@nestjs/swagger';
import { CreateBorrowDto } from './create-borrow.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateBorrowDto extends PartialType(CreateBorrowDto) {
  @ApiProperty({
    description: 'Date when the book was returned (ISO format)',
    example: '2025-09-20T15:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  return_date?: Date;

  @ApiProperty({
    description: 'Indicates whether the book was returned overdue',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  overdue?: boolean;
}
