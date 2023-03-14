import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getLoginUser(
    @GetUser() user: Omit<User, 'hashedPassword'>,
  ): Omit<User, 'hashedPassword'> {
    return user;
  }

  @Patch()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: Omit<User, 'hashedPassword'>,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return await this.userService.updateUser(updateUserDto, user.id)
  }
}
