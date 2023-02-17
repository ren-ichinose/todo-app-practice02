import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
