import * as path from "path";
import { env } from '../../../env';

export const filePath = (filePath: string) => {
    return path.join(process.cwd(), filePath);
};

export const stringifyJSON = <T>(data: T): string => {
    return data ? JSON.stringify(data) : "";
};

export const isRequestDataPrintable = <T>(reqData: T): boolean => {
    return reqData ? true : false;
};

export const shouldAxiosRetry = <T>(error: T): boolean => {
    const { status } = (error as any)?.response || {};
    console.log("custom",env, status, env.config.retriesStatuses);
    const isFound = env.config.retriesStatuses.findIndex(item => Number(item) === Number(status));
    if(isFound !== -1) return true;
    return false;
};
