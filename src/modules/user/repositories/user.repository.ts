import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
import { CrudInterface } from '../../../shared/implementations/crud.interface';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { Users } from '../entities/Users.entity';

export class UserRepository implements CrudInterface<Users> {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async create(data: CreateUserDTO): Promise<Users> {
    try {
      const user = await this.userRepository.save(
        this.userRepository.create({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      );

      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findByEmail(email: string): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      return user || null;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findById(id: string): Promise<Users | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      return user || null;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async update(data: UpdateUserDTO): Promise<any> {
    try {
      const user = await this.userRepository.update(data.id, { ...data });

      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const user = await this.userRepository.delete(id);

      return user;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
