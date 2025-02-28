import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface RequestArgs {
  [key: string]: any;
}
export interface RequestHeaders {
  [key: string]: string;
}


export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime?: Date;
    endTime?: Date;
  };
}

export interface CustomAxiosResponseConfig extends AxiosResponse {
  duration: number;
}