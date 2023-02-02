import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { Users } from '../entities/Users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  public async create({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<Users> {
    try {
      const checkIfUserExists = await this.usersRepository.findOne({
        where: { email },
      });

      if (checkIfUserExists)
        throw new BadRequestException('Usuário com e-mail já cadastrado');

      const user = this.usersRepository.create({
        name,
        email,
        password: await hash(password, 8),
      });

      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async index(id: string): Promise<Users> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('Usuário não encontrado');

      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async update({
    id,
    name,
    email,
    password,
  }: UpdateUserDTO): Promise<UpdateResult> {
    try {
      const checkIfUserExists = await this.usersRepository.findOne({
        where: { id },
      });

      if (!checkIfUserExists)
        throw new NotFoundException('Usuário não encontrado');

      const updatedUser = await this.usersRepository.update(
        checkIfUserExists.email,
        { name, email, password: await hash(password, 8) },
      );

      return updatedUser;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async delete(id: string): Promise<DeleteResult> {
    try {
      const checkIfUserExists = await this.usersRepository.findOne({
        where: { id },
      });

      if (!checkIfUserExists)
        throw new BadRequestException('Usuário não encontrado');

      const deletedUser = await this.usersRepository.delete(
        checkIfUserExists.id,
      );

      return deletedUser;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
