import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { UserToken } from './models/UserToken';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginRequestBody } from './models/LoginRequestBody';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Authenticate user and return JWT token',
  })
  @ApiBody({
    description: 'User login credentials',
    type: LoginRequestBody,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() request: AuthRequest): Promise<UserToken> {
    const data = this.authService.login(request.user);

    return data;
  }
}
