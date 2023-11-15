import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from '../../config/constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { RefreshTokenDto } from './dto/refresh.token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(loginDto);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.cookie('accessToken', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.cookie('refreshToken', tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

    return tokens;
  }

  @Get('profile')
  getProfile(@ActiveUser('sub') sub: number) {
    return this.userService.findOne(sub);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
