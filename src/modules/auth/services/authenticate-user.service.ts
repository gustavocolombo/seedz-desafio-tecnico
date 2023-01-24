import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Users } from '../../user/entities/Users.entity';
import { AuthenticateUserDTO } from '../dtos/authenticate-user.dto';
import { AuthenticateUserReturn } from '../serializers/authenticate-user-return.serializer';
import { sign } from 'jsonwebtoken';
import secrets from '../../../shared/config/auth/secrets';

@Injectable()
export class AuthenticateUserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  public async authenticate({
    email,
    password,
  }: AuthenticateUserDTO): Promise<AuthenticateUserReturn> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException('User not found, try again');

    const comparePass = await compare(password, user.password);

    if (!comparePass)
      throw new UnauthorizedException(
        'Combination of e-mail/password invalid, try again',
      );

    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      secrets.secret,
      {
        expiresIn: secrets.expiresIn,
        subject: user.id,
      },
    );

    return {
      user,
      token,
    };
  }
}
