import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBorrowDto {
  @ApiProperty({
    example: 'c5c9f420-6d5b-11ee-b962-0242ac120002',
    description: 'Reader ID',
  })
  @IsNotEmpty()
  @IsUUID()
  readerId: string;

  @ApiProperty({
    example: 'b3b5f1d2-6d5b-11ee-b962-0242ac120002',
    description: 'Book ID',
  })
  @IsNotEmpty()
  @IsUUID()
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
