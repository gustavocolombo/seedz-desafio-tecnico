import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateProductsDTO } from '../dtos/create-products.dto';
import { UpdateProductsDTO } from '../dtos/update-products.dto';
import { Products } from '../entities/Products.entity';
import { ProductsService } from '../services/products.service';

@Controller('/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createProduct(
    @Body() { name, qtdAvailable, price }: CreateProductsDTO,
  ): Promise<Products> {
    return await this.productsService.create({ name, qtdAvailable, price });
  }

  @Get()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getProducts(): Promise<Products[]> {
    return await this.productsService.show();
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getProduct(@Param('id') id: string): Promise<Products | null> {
    return await this.productsService.index(id);
  }

  @Patch()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async updateProduct(
    @Body() { id, name, qtdAvailable, price }: UpdateProductsDTO,
  ): Promise<UpdateResult> {
    return await this.productsService.update({ id, name, qtdAvailable, price });
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async deleteProduct(@Param('id') id: string): Promise<DeleteResult> {
    return await this.productsService.delete(id);
  }
}
