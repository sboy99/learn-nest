import { User } from '@/decorators';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User as TUser } from '@prisma/client';
import { AccessTokenGuard } from '../auth/guards';
import { UserService } from './user.service';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async showUser(@User() user: TUser) {
    return this.userService.handleShowUser(user);
  }
}
