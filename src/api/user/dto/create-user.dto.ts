import {
  IsEmail,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/enum/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongPassword!23' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ enum: AccessRoles, required: false })
  @IsOptional()
  @IsEnum(AccessRoles)
  role?: AccessRoles;
}
