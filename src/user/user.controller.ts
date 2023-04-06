import { AccessTokenGuard } from '@/auth/guards';
import { User } from '@/decorators';
import { IRes } from '@/interfaces';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User as TUser } from '@prisma/client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<
    | (IRes<Pick<TUser, 'id' | 'email' | 'username' | 'created_at'>[]> & {
        count: number;
      })
    | never
  > {
    const users = await this.userService.getAllUsers();
    return {
      code: 'SUCCESS',
      message: `successfully found ${users.length} users`,
      count: users.length,
      data: users,
    };
  }
  @Get('me')
  @UseGuards(AccessTokenGuard)
  async showUser(
    @User('userId') userId: string
  ): Promise<Pick<TUser, 'id' | 'email' | 'username'> | never> {
    return this.userService.handleShowUser(userId);
  }

  @Get(':id')
  async getUser(
    @Param('id') userId: string
  ): Promise<IRes<Omit<TUser, 'password'>> | never> {
    const user = await this.userService.getUser(userId);
    delete user.password;
    return {
      code: 'SUCCESS',
      message: 'Success',
      data: user,
    };
  }
}
