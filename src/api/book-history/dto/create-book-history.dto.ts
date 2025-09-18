import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateBookHistoryDto {
  @ApiProperty({ example: 'c5c9f420-6d5b-11ee-b962-0242ac120002', description: 'Reader ID' })
  @IsNotEmpty()
  @IsUUID()
  readerId: string;

  @ApiProperty({ example: 'b3b5f1d2-6d5b-11ee-b962-0242ac120002', description: 'Book ID' })
  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: '2025-09-10', description: 'Borrow date' })
  @IsOptional()
  @IsDateString()
  borrowedAt?: Date;

  @ApiProperty({ example: '2025-09-18', description: 'Return date' })
  @IsOptional()
  @IsDateString()
  returnedAt?: Date;
}
