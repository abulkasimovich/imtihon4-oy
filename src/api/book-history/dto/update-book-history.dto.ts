import { PartialType } from '@nestjs/swagger';
import { CreateBookHistoryDto } from './create-book-history.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateBookHistoryDto extends PartialType(CreateBookHistoryDto) {}
