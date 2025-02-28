import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from "axios";
import { logApiError, logApiResponse, logApiRequest } from "./logApi";
import type { CustomAxiosResponseConfig } from "../../interfaces/HttpClient";

export const InitializeInterceptors = (axios: AxiosInstance): void => {
    /**
     * log the request and mock the data if enabled
     * @param config 
     * @returns 
     */
    const requestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        (config as any).metadata = { startTime: new Date() }; // Metadata is not a default property, so it's casted
        await logApiRequest(config);
        return config;
    }

    const responseInterceptor = async (response: AxiosResponse): Promise<AxiosResponse> => {
        await logApiResponse(response as CustomAxiosResponseConfig);
        return Promise.resolve(response);
    }

    const responseErrorInterceptor = async (error: AxiosError): Promise<never> => {
        await logApiError(error);
        return Promise.reject(error);

    };

    axios.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
    axios.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
}