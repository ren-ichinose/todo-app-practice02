import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Jwt, Msg } from './interfaces/suth.interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authDto: AuthDto): Promise<Msg> {
    const { email, password } = authDto;
    const salt = await bcrypt.genSalt();
    const hashed =await bcrypt.hash(password, salt);
    try {
      await this.prisma.user.create({
        data: {
          email,
          password: hashed,
        },
      });
      return { message: 'OK' };
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError){
        if(error.code === 'P2002'){
          throw new ForbiddenException('This email is already taken')
        }
      }
      throw error;
    }
  }

  async logIn(authDto: AuthDto): Promise<Jwt> {
    const { email, password } = authDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    const isValid = await bcrypt.compare(password, user.password);
    if(!user || !isValid) {
      throw new ForbiddenException('Email or password incorrect')
    }
    return await this.generateJwt(user.id, email);
  }

  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
