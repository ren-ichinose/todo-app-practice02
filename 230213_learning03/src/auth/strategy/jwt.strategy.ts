import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          if(req && req.cookies){
            jwt = req.cookies['access_token']
          }
          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }): Promise<Omit<User, 'password'>>{
    const { sub, email } = payload;
    const user = await this.prisma.user.findFirst({
      where: {
        id: sub,
        email,
      },
    });
    if(user) {
      const { password, ...deletePasswordUser } = user;
      return deletePasswordUser;
    }
    throw new UnauthorizedException();
  }
}