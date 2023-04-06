import { SetMetadata } from '@nestjs/common';
import { User as TUser } from '@prisma/client';

export const AllowedRoles = (...roles: Array<TUser['role']>) =>
  SetMetadata('roles', roles);
