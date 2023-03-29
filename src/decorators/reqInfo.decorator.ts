import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ReqInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const info = {
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };
    return info;
  },
);
