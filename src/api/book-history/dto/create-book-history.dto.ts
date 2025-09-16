import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookHistoryDto {
  @ApiProperty({
    description: 'ID of the user who borrowed the book',
    example: '7c3f5c9d-5f41-42c3-84d1-5de88f2c1234',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID of the borrowed book',
    example: 'd2a5b2b1-9c3a-4f12-91f1-0bda2f4b5678',
  })
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({
    description: 'Borrow date (ISO format)',
    example: '2025-09-16T10:00:00.000Z',
  })
  @IsDateString()
  borrow_date: Date;

  @ApiProperty({
    description: 'Due date for returning the book (ISO format)',
    example: '2025-09-23T10:00:00.000Z',
  })
  @IsDateString()
  due_date: Date;

  @ApiProperty({
    description: 'Return date of the book (ISO format)',
    example: '2025-09-21T14:20:00.000Z',
  })
  @IsDateString()
  return_date: Date;

  @ApiProperty({
    description: 'Indicates whether the book was returned overdue',
    example: false,
  })
  overdue: boolean;
}
