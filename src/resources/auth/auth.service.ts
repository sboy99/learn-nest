import { DatabaseService } from '@/database/database.service';
import { AuthDto } from '@/dto';
import { IAuthRes } from '@/interfaces/auth.interface';
import { comparePassword, getHashedPassword } from '@/lib/utils';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private db: DatabaseService) {}

  async handleRegistration(dto: AuthDto): Promise<IAuthRes | never> {
    const hashPassword = await getHashedPassword(dto.password);

    try {
      const user = await this.db.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashPassword,
        },
      });

      delete user.password;

      return {
        code: 'SUCCESS',
        message: 'Registration successful',
        user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }

  async handleLogin(dto: Omit<AuthDto, 'username'>): Promise<IAuthRes | never> {
    // find user by email address
    const user = await this.db.user.findFirst({
      where: { email: dto.email },
    });

    // if user is not found throw exception
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if password matches
    const valid = await comparePassword(dto.password, user.password);

    if (!valid) {
      throw new ForbiddenException('Invalid password');
    }
    delete user.password;

    return {
      code: 'SUCCESS',
      message: 'Login successful',
      user,
    };
  }
}
