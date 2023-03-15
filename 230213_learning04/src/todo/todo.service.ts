import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
