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
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { Users } from '../entities/Users.entity';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    description:
      'Operação responsável por criar um novo usuário no banco de dados',
  })
  @ApiOkResponse({
    description: 'O usuário foi criado com sucesso',
    status: 201,
  })
  @ApiBadRequestResponse({
    description: 'Usuário com endereço de e-mail já cadastrado',
    status: 400,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createUser(
    @Body() { name, email, password }: CreateUserDTO,
  ): Promise<Users> {
    return await this.usersService.create({ name, email, password });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por buscar um usuário pelo id',
  })
  @ApiOkResponse({
    description: 'usuário foi retornada com sucesso',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'O usuário não foi encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getUser(@Param('id') id: string): Promise<Users> {
    return await this.usersService.index(id);
  }

  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por atualizar as informações do usuário',
  })
  @ApiOkResponse({
    description: 'O usuário foi atualizado com sucesso',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'O usuário não foi encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async updateUser(
    @Body() { name, email, password }: UpdateUserDTO,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.usersService.update({ id, name, email, password });
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Operação responsável por deleter as informações do usuário',
  })
  @ApiOkResponse({
    description: 'O usuário foi deletado com sucesso',
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'O usuário não foi encontrado',
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description: 'O usuário não tem permissão, por favor realize login',
    status: 401,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersService.delete(id);
  }
}
