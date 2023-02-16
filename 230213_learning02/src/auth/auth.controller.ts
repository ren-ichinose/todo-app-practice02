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
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }

  @Post('signup')
  async signUp(@Body() authDto: AuthDto): Promise<Msg> {
    return await this.authService.signUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.logIn(authDto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });
    return { message: 'OK' };
  }
}
