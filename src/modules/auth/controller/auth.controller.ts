import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticateUserDTO } from '../dtos/authenticate-user.dto';
import { AuthenticateUserReturn } from '../serializers/authenticate-user-return.serializer';
import { AuthenticateUserService } from '../services/authenticate-user.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authenticateService: AuthenticateUserService) {}

  @Post()
  @ApiOperation({
    description:
      'Operação responsável por criar o token JWT para autenticação do usuário',
  })
  @ApiOkResponse({
    description: 'O token foi retornado com sucesso',
    status: 201,
  })
  @ApiNotFoundResponse({
    description: 'O usuário não foi encontrado',
    status: 404,
  })
  @ApiBadRequestResponse({
    description: 'Combinação de credenciais inválidas',
    status: 400,
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createTokenJWT(
    @Body() { email, password }: AuthenticateUserDTO,
  ): Promise<AuthenticateUserReturn> {
    return await this.authenticateService.authenticate({ email, password });
  }
}
