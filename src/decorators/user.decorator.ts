import { IJwtUser } from '@/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (
    data: keyof IJwtUser | undefined,
    ctx: ExecutionContext,
  ): IJwtUser | IJwtUser[keyof IJwtUser] => {
    const request = ctx.switchToHttp().getRequest() as Request;
    if (!data) return request.user as IJwtUser;
    return request.user[data];
  },
);
