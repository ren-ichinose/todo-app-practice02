import { Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { createTaskDto } from './dto/create-task.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTasks(userId: string): Promise<Task[]> {
    const tasks = await this.prismaService.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return tasks;
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    return await this.prismaService.task.findFirst({ where: { id, userId } });
  }

  async createTask(
    createTaskDto: createTaskDto,
    userId: string,
  ): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = await this.prismaService.task.create({
      data: {
        title,
        description: description || null,
        userId,
      },
    });
    return task;
  }
}
