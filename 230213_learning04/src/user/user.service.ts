import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(updateUserDto: UpdateUserDto, id: string):Promise<Omit<User, 'hashedPassword'>> {
    const { nickName } = updateUserDto;
    const user = await this.prismaService.user.update({
      where: { id },
      data: { nickName },
    });
    const { hashedPassword, ...userWithoutHashedPassword } = user;
    return userWithoutHashedPassword;
  }
}
