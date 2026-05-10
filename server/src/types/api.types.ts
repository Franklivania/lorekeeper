export type ApiStatus = "success" | "error";

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T | null;
  message: string;
};

export function ok<T>(data: T, message = "Request completed successfully"): ApiResponse<T> {
  return { status: "success", data, message };
}

export function err(message: string): ApiResponse<null> {
  return { status: "error", data: null, message };
}
