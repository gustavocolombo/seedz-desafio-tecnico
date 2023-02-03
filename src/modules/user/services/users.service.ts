import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { Users } from '../entities/Users.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  public async create({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<Users> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (user)
        throw new BadRequestException('Usuário com e-mail já cadastrado');

      const data = { name, email, password: await hash(password, 8) };

      const newUser = this.userRepository.create(data);

      return newUser;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async index(id: string): Promise<Users> {
    try {
      const user = await this.userRepository.findById(id);

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
      const checkIfUserExists = await this.userRepository.findById(id);

      if (!checkIfUserExists)
        throw new NotFoundException('Usuário não encontrado');

      const data = { id, name, email, password };
      const updatedUser = await this.userRepository.update(data);

      return updatedUser;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async delete(id: string): Promise<DeleteResult> {
    try {
      const checkIfUserExists = await this.userRepository.findById(id);

      if (!checkIfUserExists)
        throw new BadRequestException('Usuário não encontrado');

      const deletedUser = await this.userRepository.delete(
        checkIfUserExists.id,
      );

      return deletedUser;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
