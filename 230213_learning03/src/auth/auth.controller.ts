import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/suth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServoce: AuthService) {}

  @Get('csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }

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
  async logOut(@Res({ passthrough: true }) res: Response): Promise<Msg> {
    res.clearCookie('access_token');
    return { message: 'OK' };
  }
}