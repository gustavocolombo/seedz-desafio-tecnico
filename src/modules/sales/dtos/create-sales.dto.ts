import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSalesDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID(4)
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID(4)
  product_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  qtdProducts: number;
}
