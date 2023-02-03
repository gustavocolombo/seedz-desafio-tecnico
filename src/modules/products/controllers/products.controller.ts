import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateProductsDTO } from '../dtos/create-products.dto';
import { UpdateProductsDTO } from '../dtos/update-products.dto';
import { Products } from '../entities/Products.entity';
import { ProductsService } from '../services/products.service';

@ApiTags('Products')
@Controller('/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por criar um novo produto',
  })
  @ApiOkResponse({
    description: 'O produto foi criado com sucesso',
    status: 201,
  })
  @ApiBadRequestResponse({
    description: 'Não foi possível criar o produto',
    status: 400,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createProduct(
    @Body() { name, qtdAvailable, price }: CreateProductsDTO,
  ): Promise<Products> {
    return await this.productsService.create({ name, qtdAvailable, price });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por buscar um produto pelo id',
  })
  @ApiOkResponse({
    description: 'O produto foi buscado com sucesso',
    status: 201,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getProduct(@Param('id') id: string): Promise<Products> {
    return await this.productsService.index(id);
  }

  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Operação responsável por atualizar as informações de um produto',
  })
  @ApiOkResponse({
    description: 'O produto foi atualizado com sucesso',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async updateProduct(
    @Body() { id, name, qtdAvailable, price }: UpdateProductsDTO,
  ): Promise<UpdateResult> {
    return await this.productsService.update({ id, name, qtdAvailable, price });
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por deletar um  produto',
  })
  @ApiOkResponse({
    description: 'O produto foi deletado com sucesso',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async deleteProduct(@Param('id') id: string): Promise<DeleteResult> {
    return await this.productsService.delete(id);
  }
}
