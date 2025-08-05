import { ExceptionResponse } from '../interfaces/exception-response';

export function isExceptionResponse(obj: unknown): obj is ExceptionResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('message' in obj || 'data' in obj)
  );
}
