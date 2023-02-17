import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Msg } from './interfaces/suth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServoce: AuthService) {}

  @Post('signup')
  async signUp(@Body() authDto: AuthDto): Promise<Msg> {
    return await this.authServoce.signUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authServoce.logIn(authDto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });
    return { message: 'OK' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logOut(
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    res.clearCookie('access_token');
    return { message: 'OK' };
  }
}
