import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
type TAllowedParam = 'userId' | undefined;
export const UseParam = createParamDecorator(
  (data: TAllowedParam, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    if (!data) return req.params;
    return req.params[data];
  },
);
