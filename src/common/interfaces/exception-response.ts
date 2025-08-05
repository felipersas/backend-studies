export interface ExceptionResponse<T = unknown> {
  message?: string;
  data?: T;
  [key: string]: unknown;
}
