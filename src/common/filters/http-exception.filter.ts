import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isExceptionResponse } from '../utils/type-guards';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: object | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (isExceptionResponse(exceptionResponse)) {
        message = exceptionResponse.message || message;
        data = exceptionResponse.data || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    response.status(status).json({
      success: false,
      message,
      data,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
