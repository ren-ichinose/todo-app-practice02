import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { TodoService } from './todo.service';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTasks(@GetUser() user: User): Promise<Task[]> {
    return await this.todoService.getTasks(user.id);
  }
}
