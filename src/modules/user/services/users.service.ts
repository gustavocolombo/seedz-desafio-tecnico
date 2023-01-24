import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
    const checkIfUserExists = await this.usersRepository.findOne({
      where: { email },
    });

    if (checkIfUserExists) throw new BadRequestException('User already exists');

    const user = this.usersRepository.create({
      name,
      email,
      password: await hash(password, 8),
    });

    await this.usersRepository.save(user);

    return user;
  }

  public async index(id: string): Promise<Users | null> {
    const user = await this.usersRepository.findOne({ where: { id } });

    return user || null;
  }

  public async update({
    id,
    name,
    email,
    password,
  }: UpdateUserDTO): Promise<UpdateResult> {
    const checkIfUserExists = await this.usersRepository.findOne({
      where: { id },
    });

    if (!checkIfUserExists) throw new BadRequestException('User not found');

    const updatedUser = await this.usersRepository.update(
      checkIfUserExists.email,
      { name, email, password: await hash(password, 8) },
    );

    return updatedUser;
  }

  public async delete(id: string): Promise<DeleteResult> {
    const checkIfUserExists = await this.usersRepository.findOne({
      where: { id },
    });

    if (!checkIfUserExists) throw new BadRequestException('User not found');

    const deletedUser = await this.usersRepository.delete(checkIfUserExists.id);

    return deletedUser;
  }
}
