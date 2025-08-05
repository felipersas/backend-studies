import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const hasMessage = (obj: unknown): obj is { message: string } => {
      return (
        typeof obj === 'object' &&
        obj !== null &&
        'message' in obj &&
        typeof (obj as { message: unknown }).message === 'string'
      );
    };

    const hasData = (data: unknown) => {
      return typeof data === 'object' && data !== null && 'data' in data;
    };

    return next.handle().pipe(
      map((data) => {
        if (
          typeof data === 'object' &&
          data !== null &&
          'success' in data &&
          'message' in data &&
          'data' in data
        ) {
          return data;
        }

        const statusCode =
          typeof response?.statusCode === 'number' ? response.statusCode : 200;

        return {
          success: true,
          message: hasMessage(data) ? data.message : 'Request successful',
          data: hasData(data) ? data.data : data,
          statusCode,
          timestamp: new Date().toISOString(),
          path: request?.url,
        };
      }),
    );
  }
}
