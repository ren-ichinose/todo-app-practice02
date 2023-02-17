import { ForbiddenException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prism: PrismaService) {}

  async getTasks(userId: number): Promise<Task[]> {
    return await this.prism.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTaskById(id: number, userId: number): Promise<Task> {
    return await this.prism.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: number,
  ): Promise<Task> {
    return await this.prism.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
  }

  async updateTaskById(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    const task = await this.prism.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permission to update');
    }
    return await this.prism.task.update({
      where: {
        id,
      },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async deleateTaskById(id: number, userId: number): Promise<void> {
    const task = await this.prism.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permission to delete');
    }
    await this.prism.task.delete({
      where: {
        id,
      },
    });
  }
}
