import { IRes } from '@/interfaces';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.message
        : exception?.message ?? 'Internal Server Error';

    const exceptionPayload: IRes<string | object> = {
      code: 'ERROR',
      message,
      data: exception instanceof HttpException && exception.getResponse(),
    };

    console.log(exception);

    response.status(status).json(exceptionPayload);
  }
}
