import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Jwt, Msg } from './interfaces/auth.interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authDto: AuthDto): Promise<Msg> {
    const { email, password } = authDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      await this.prismaService.user.create({
        data: {
          email,
          hashedPassword,
        },
      });
      return { message: 'OK' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already taken');
        }
      }
      throw error;
    }
  }

  async login(authDto: AuthDto): Promise<Jwt> {
    const { email, password } = authDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new ForbiddenException('Email or password incorrect');
    }
    return this.generateJwt(user.id, user.email);
  }

  async generateJwt(id: string, email: string): Promise<Jwt> {
    const payload = { id, email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
