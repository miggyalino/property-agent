export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const apiResponse = <T>(message: string, data: T): ApiResponse<T> => ({
  message,
  data,
});
