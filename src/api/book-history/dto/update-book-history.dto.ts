import { PartialType } from '@nestjs/swagger';
import { CreateBookHistoryDto } from './create-book-history.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateBookHistoryDto extends PartialType(CreateBookHistoryDto) {
  @ApiProperty({
    description: 'Updated return date (ISO format)',
    example: '2025-09-22T12:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  return_date?: Date;

  @ApiProperty({
    description: 'Updated overdue status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  overdue?: boolean;
}
