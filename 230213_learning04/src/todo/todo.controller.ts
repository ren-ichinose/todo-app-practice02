import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { createTaskDto } from './dto/create-task.dto';
import { TodoService } from './todo.service';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTasks(
    @GetUser() user: Omit<User, 'hashedPassword'>,
  ): Promise<Task[]> {
    return await this.todoService.getTasks(user.id);
  }

  @Get(':id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.todoService.getTaskById(id, user.id);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: createTaskDto,
    @GetUser() user: Omit<User, 'hashedPassword'>,
  ): Promise<Task> {
    return this.todoService.createTask(createTaskDto, user.id);
  }
}
