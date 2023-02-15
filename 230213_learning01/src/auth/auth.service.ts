import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Jwt, Msg } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(authDto: AuthDto): Promise<Msg> {
    const { email, password } = authDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await this.prisma.user.create({
        data: {
          email,
          hashedPassword,
        },
      });
      return { message: 'ok' };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('This email is already taken');
      }
      throw error;
    }
  }

  async login(authDto: AuthDto): Promise<Jwt> {
    const user = await this.prisma.user.findUnique({
      where: { email: authDto.email }
    });
    if(!user) {
      throw new ForbiddenException('Email or password incorrect');
    }
    const isValid = await bcrypt.compare(authDto.password, user.hashedPassword);
    if(!isValid) {
      throw new ForbiddenException('Email or password incorrect');
    }
    return this.generateJwt(user.id, user.email);
  }

  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      secret: this.configService.get('JWT_SECRET')
    });
    return { accessToken } ;
  }
}

