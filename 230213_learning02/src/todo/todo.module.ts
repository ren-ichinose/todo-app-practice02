import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [PrismaService],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
