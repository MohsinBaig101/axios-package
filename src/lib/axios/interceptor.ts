import { logApiRequest, logApiError } from './logApi';
export const InitializeInterceptors = (axios) => {
    /** log the request and mock the data if enabled */
    const requestInterceptor = async (config: any): Promise<any> => {
        config.metadata = { startTime: new Date() };

        await logApiRequest(config);
        // await hasMock(config);
        return config;
    }

    /** if mock enabled response with mock response */

    const responseInterceptor = async (response: any): Promise<any> => {
        await logApiRequest(response);

        return Promise.resolve(response);
    }

    const responseErrorInterceptor = async (error: any): Promise<any> => {
        await logApiError(error);

        // await isMock(error);

        // const result = await handleException(error, axios);
        // if (result && result.success) {
        //     return result;
        // }
    }

    axios.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
    axios.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
}