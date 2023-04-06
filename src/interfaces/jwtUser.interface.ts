import { User } from '@prisma/client';

export interface IJwtUser {
  userId: User['id'];
  email: User['email'];
  role: User['role'];
  refreshToken?: string;
}
