import { logApiError, logApiResponse, logApiRequest } from "./logApi";

export const InitializeInterceptors = (axios: any): void => {
    /**
     * log the request and mock the data if enabled
     * @param config 
     * @returns 
     */
    const requestInterceptor = async (config: any): Promise<any> => {
        config.metadata = { startTime: new Date() };
        await logApiRequest(config);
        // await hasMock(config);
        return config;
    }

    const responseInterceptor = async (response: any): Promise<any> => {
        await logApiResponse(response);
        return Promise.resolve(response);
    }

    const responseErrorInterceptor = async (error: any): Promise<any> => {
        await logApiError(error);

        // await isMock(error);
        return Promise.reject(error);

    };

    axios.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
    axios.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
}