export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}
