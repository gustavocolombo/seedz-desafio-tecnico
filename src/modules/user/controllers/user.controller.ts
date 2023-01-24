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
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { Users } from '../entities/Users.entity';
import { UsersService } from '../services/users.service';

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createUser(
    @Body() { name, email, password }: CreateUserDTO,
  ): Promise<Users> {
    return await this.usersService.create({ name, email, password });
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async getUser(@Param('id') id: string): Promise<Users | null> {
    return await this.usersService.index(id);
  }

  @Patch()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async updateUser(
    @Body() { name, email, password }: UpdateUserDTO,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return await this.usersService.update({ id, name, email, password });
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersService.delete(id);
  }
}
