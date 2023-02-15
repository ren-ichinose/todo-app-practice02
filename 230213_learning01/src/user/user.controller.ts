import { Controller, Get, Req } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //下記の記述はRequestの型定義を起因とするエラーが発生する。
  //理由）validateによるUserオブジェクトがRequesutには含まれていないため。
  //対処）custom.d.tsを作成し、型定義を再定義した。
  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    return req.user;
  }
}
