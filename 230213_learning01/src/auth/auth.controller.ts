import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Jwt, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    ) {}

  @Post('signup')
  async signUp(@Body() authDto: AuthDto): Promise<Msg> {
    return await this.authService.signUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(
    @Body() authDto: AuthDto, 
    @Res({ passthrough: true }) res: Response
  ): Promise<Msg> {
    const jwt = await this.authService.login(authDto);
    res.cookie('accessToken', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/'
    });
    return { message: 'ok'};
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logOut(
    @Body() authDto: AuthDto, 
    @Res({ passthrough: true }) res: Response
  ): Promise<Msg> {
    // 下記の記述方法も存在する
    // res.clearCookie('accessToken');
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/'
    });
    return { message: 'ok'};

  }
}
