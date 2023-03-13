import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  getLoginUser(
    @GetUser() user: Omit<User, 'hashedPassword'>,
  ): Omit<User, 'hashedPassword'> {
    return user;
  }
}
