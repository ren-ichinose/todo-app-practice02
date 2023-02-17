import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from '@prisma/client';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TodoService } from './todo.service';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTasks(@Req() req: Request): Promise<Task[]> {
    return this.todoService.getTasks(req.user.id);
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.todoService.getTaskById(id, req.user.id);
  }

  @Post()
  async CreateTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.todoService.createTask(createTaskDto, req.user.id);
  }

  @Patch(':id')
  async updateTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.todoService.updateTaskById(
      id,
      updateTaskDto,
      req.user.id,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTaskById(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<void> {
    return await this.todoService.deleateTaskById(id, req.user.id);
  }
}
