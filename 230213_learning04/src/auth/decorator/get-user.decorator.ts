import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const user: Omit<User, 'hashedPassword'> = ctx
    .switchToHttp()
    .getRequest<Request>().user;
  return user;
});
