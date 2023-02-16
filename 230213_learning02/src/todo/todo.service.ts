import { ForbiddenException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  getTasks(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getTaskById(userId: number, taskId: number): Promise<Task> {
    return this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    });
  }

  async createTask(
    userId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
    return task;
  }

  async updateTaskById(
    userId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);
    if (!task || userId !== task.userId) {
      throw new ForbiddenException('No permision to update');
    }
    return await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async deleteTaskById(userId: number, taskId: number): Promise<void> {
    const task = await this.getTaskById(userId, taskId);
    if (!task || userId !== task.userId) {
      throw new ForbiddenException('No permision to delete');
    }
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
