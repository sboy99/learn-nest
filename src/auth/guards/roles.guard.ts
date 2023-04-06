import { IJwtUser } from '@/interfaces';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User as TUser } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const allowedRoles = this.reflector.getAllAndOverride<Array<TUser['role']>>(
      'roles',
      [context.getHandler(), context.getClass()]
    );

    if (!allowedRoles || !allowedRoles.length) return true;

    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as IJwtUser;

    if (allowedRoles.includes(user.role)) return true;

    return false;
  }
}
