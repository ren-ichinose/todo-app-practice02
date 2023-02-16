import { User } from '@prisma/client';

//既存の型定義を拡張して再定義している
declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'hashedPassword'>;
  }
}
