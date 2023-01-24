import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UpdateProductsDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  qtdAvailable?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;
}
