import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBorrowDto {
  @ApiProperty({
    description: 'ID of the user borrowing the book',
    example: 'f3c6a63e-9b25-4c7a-8c31-5f0c3b2e4a01',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID of the book being borrowed',
    example: 'b2a9f1f0-234a-4e3e-9fcd-1a7b47a83c45',
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
}
