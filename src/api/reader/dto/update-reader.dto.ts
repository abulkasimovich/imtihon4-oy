import { PartialType } from '@nestjs/mapped-types';
import { CreateReaderDto } from './create-reader.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateReaderDto extends PartialType(CreateReaderDto) {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
