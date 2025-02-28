import { CurlHelper } from './curlHelper';
import { env } from '../../../env';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { CustomAxiosRequestConfig, CustomAxiosResponseConfig } from '../../interfaces/HttpClient';

export const logApiRequest = (config: AxiosRequestConfig) => {
    // for curl logger
    if (env.constants.enableCurl) {
        console.log(CurlHelper.generateCommand(config, env.constants.inlineCurl));
    }
}
export const logApiResponse = (response: CustomAxiosResponseConfig) => {
    if (env.constants.enableApiInterceptorLog) {
        const config = response.config as CustomAxiosRequestConfig;
        config.metadata.endTime = new Date();
        response.duration = config.metadata.endTime.getTime() - config.metadata.startTime.getTime() || 0;
        const { config: { url }, data, duration } = response;
        const printData = jsonStringify(data).length < 25000; // Don't print File bytes
        const logData = { url, duration, ...(printData) ? { data } : {} }
        console.log(env.isProduction ? jsonStringify(logData) : logData);
    }
}

export const logApiError = (error: AxiosError) => {
    if (env.constants.enableApiInterceptorLog && error.config) {
        const config = error.config as CustomAxiosRequestConfig;
        config.metadata.endTime = new Date();
        (error as any).duration = config.metadata.endTime.getTime() - config.metadata.startTime.getTime();
        console.log(error);
        const { response: { status, statusText, data, config: { url } = {} as any, duration } = {} as any } = error;
        const logData = { url, duration, status, statusText, data };
        console.log(env.isProduction ? jsonStringify(logData) : logData);
    }
}

const jsonStringify = (json: unknown) => {
    try {
        return JSON.stringify(json);
    } catch (err) {
        return '';
    }
}