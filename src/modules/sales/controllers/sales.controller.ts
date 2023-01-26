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
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateSalesDTO } from '../dtos/create-sales.dto';
import { Sales } from '../entities/Sales.entity';
import { SalesService } from '../services/sales.service';

@ApiTags('Sales')
@Controller('/sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
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
  ): Promise<Sales[] | null> {
    return await this.salesService.getSaleByUser(user_id);
  }
}
