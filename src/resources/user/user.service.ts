import { DatabaseService } from '@/database/database.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User as TUser } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}
  /**
   *
   * @param userId string
   * @returns {
   * id: string;
   * username: string;
   * email: string;
   * }
   */
  async handleShowUser(
    userId: string
  ): Promise<Pick<TUser, 'id' | 'email' | 'username'> | never> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        ShoppingSession: {
          select: {
            id: true,
            total: true,
            CartItem: {
              select: {
                Product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
                quantity: true,
              },
            },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('user does not exist');
    return user;
  }

  async getAllUsers(): Promise<
    Pick<TUser, 'id' | 'email' | 'username' | 'created_at'>[] | never
  > {
    const users = await this.db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });
    return users;
  }

  async getUser(userId: string): Promise<TUser | never> {
    if (!userId || userId === ':userId')
      throw new BadRequestException('userId should not be empty');
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
