import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Msg } from 'src/auth/interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly Prisma: PrismaService) {}

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.Prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updateUserDto,
      },
    });
    const { hashedPassword, ...deletePasswordUser } = user;
    return deletePasswordUser;
  }
}
