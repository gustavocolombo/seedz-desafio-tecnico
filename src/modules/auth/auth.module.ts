import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/Users.entity';
import { AuthController } from './controller/auth.controller';
import { AuthenticateUserService } from './services/authenticate-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthenticateUserService],
})
export class AuthModule {}
