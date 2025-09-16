import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/enum/roles.enum';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(AccessRoles)
  @IsOptional()
  role?: AccessRoles;
}
