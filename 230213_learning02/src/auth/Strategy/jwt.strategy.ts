import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly Prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          if(req && req.cookies) { return req.cookies['access_token']; }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: { sub: number, email: string }): Promise<Omit<User, 'hashedPassword'>> {
    const { sub, email } = payload;
    const user = await this.Prisma.user.findFirst({
      where: {
        id: sub,
        email,
      }
    })
    const { hashedPassword, ...deletePasswordUser } = user;
    return deletePasswordUser;
  }
}