import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(updateUserDto: UpdateUserDto, id: number): Promise<Omit<User, 'password'>> {
    const { nickName } = updateUserDto;
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        nickName,
      },
    });
    const { password, ...deleatepasswordUser } = user;
    return deleatepasswordUser;
  }
}
