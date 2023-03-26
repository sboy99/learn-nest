import { Injectable } from '@nestjs/common';
import { User as TUser } from '@prisma/client';

@Injectable()
export class UserService {
  handleShowUser(user: TUser) {
    return user;
  }
}
