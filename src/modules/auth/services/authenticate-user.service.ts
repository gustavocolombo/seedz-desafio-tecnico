import {
  Injectable,
  NotFoundException,
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
import ErrorHandling from '../../../shared/errors/error-handling';

@Injectable()
export class AuthenticateUserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  public async authenticate({
    email,
    password,
  }: AuthenticateUserDTO): Promise<AuthenticateUserReturn> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user)
        throw new NotFoundException('Usuário não encontrado, tente novamente');

      const comparePass = await compare(password, user.password);

      if (!comparePass)
        throw new UnauthorizedException(
          'Combinação de e-mail/senha inválidos, tente novamente',
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
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
