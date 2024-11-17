export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface RequestArgs {
  [key: string]: any;
}
export interface RequestHeaders {
  [key: string]: string;
}
