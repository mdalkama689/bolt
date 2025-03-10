export interface  ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Message {
  content: string;
  role: string;
}
