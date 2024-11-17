import { CurlHelper } from './curlHelper';
import { env } from '../../../env';

export const logApiRequest = (config: any) => {
    // for curl logger
    if (env.constants.enableCurl) {
        console.log(CurlHelper.generateCommand(config, env.constants.inlineCurl));
    }
}
export const logApiResponse = (response: any) => {
    if (env.constants.enableApiInterceptorLog) {
        response.config.metadata.endTime = new Date();
        response.duration = response.config.metadata.endTime - response.config.metadata.starttime;
        const { config: { url }, data, duration } = response;
        const printData = jsonStringify(data).length < 25000; // Don't print PDF bytes
        const logData = { url, duration, ...(printData) ? { data } : {} }
        console.log(env.isProduction ? jsonStringify(logData) : logData);
    }
}

export const logApiError = (error: any) => {
    if (env.constants.enableApiInterceptorLog && error.config) {
        error.config.metadata.endTime = new Date();
        error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
        console.log(error);
        const { response: { status, statusText, data, config: { url } = {} as any, duration } = {} as any } = error;
        const logData = { url, duration, status, statusText, data };
        console.log(env.isProduction ? jsonStringify(logData) : logData);
    }
}

const jsonStringify = (json) => {
    try {
        return JSON.stringify(json);
    } catch (err) {
        return '';
    }
}