import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSalesDTO } from '../dtos/create-sales.dto';
import { Sales } from '../entities/Sales.entity';
import { SalesService } from '../services/sales.service';

@Controller('/sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createSale(
    @Body() { user_id, product_id, qtdProducts }: CreateSalesDTO,
  ): Promise<Sales> {
    return await this.salesService.create({ user_id, product_id, qtdProducts });
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getSaleById(@Param('id') id: string): Promise<Sales | null> {
    return await this.salesService.getSaleById(id);
  }

  @Get('/user/:user_id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getSaleByUser(
    @Param('user_id') user_id: string,
  ): Promise<Sales[] | null> {
    return await this.salesService.getSaleByUser(user_id);
  }
}
