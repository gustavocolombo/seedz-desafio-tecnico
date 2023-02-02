import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
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
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateSalesDTO } from '../dtos/create-sales.dto';
import { Sales } from '../entities/Sales.entity';
import { SalesService } from '../services/sales.service';

@ApiTags('Sales')
@Controller('/sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description: 'Operação responsável por criar uma nova venda',
  })
  @ApiOkResponse({
    description: 'A venda foi criada com sucesso',
    status: 201,
  })
  @ApiBadRequestResponse({
    description: 'Não foi possível criar a venda',
    status: 400,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  public async createSale(
    @Body() { user_id, product_id, qtdProducts }: CreateSalesDTO,
  ): Promise<Sales> {
    return await this.salesService.create({ user_id, product_id, qtdProducts });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por trazer uma venda pelo id da mesma',
  })
  @ApiOkResponse({
    description: 'A venda foi retornada com sucesso',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'A venda não foi encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getSaleById(@Param('id') id: string): Promise<Sales | null> {
    return await this.salesService.getSaleById(id);
  }

  @Get('/user/:user_id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por trazer uma venda pelo id do usuário',
  })
  @ApiOkResponse({
    description: 'A venda foi retornada com sucesso',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'A venda/usuário não foi encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getSaleByUser(
    @Param('user_id') user_id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Sales>> {
    limit = limit > 100 ? 100 : limit;
    return await this.salesService.getSaleByUser(user_id, {
      page,
      limit,
      route: 'http://localhost:3000/sales/user/:user_id',
    });
  }
}
