import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticateUserDTO } from '../dtos/authenticate-user.dto';
import { AuthenticateUserReturn } from '../serializers/authenticate-user-return.serializer';
import { AuthenticateUserService } from '../services/authenticate-user.service';

@Controller('/auth')
export class AuthController {
  constructor(private authenticateService: AuthenticateUserService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createTokenJWT(
    @Body() { email, password }: AuthenticateUserDTO,
  ): Promise<AuthenticateUserReturn> {
    return await this.authenticateService.authenticate({ email, password });
  }
}
