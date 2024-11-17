import fs from "fs";
import * as path from "path";
import bunyan from "bunyan";
import { env } from '../../../env';
export const filePath = (filePath: string) => {
    return path.join(process.cwd(), filePath);
};
export function ensureDirectoryExistence(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export const writeFileAsync = (data: Buffer, path: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(null);
        });
    });
};

/** Custom function, will convert the class validator errors */
export const validationErrorMapper = (
    validationErrors: any
): { type: string; code: string; message: string; path: string }[] => {
    const formattedErrors = [];
    return (function AnonymounsRecursiveFN(
        validationErrors: any,
        arr: any[] = []
    ): any {
        validationErrors.forEach((error) => {
            if ((error?.children || []).length > 0) {
                const push = [...arr, error?.property];
                AnonymounsRecursiveFN(error?.children, push);
                return true;
            }
            formattedErrors.push({
                type: "Functional",
                code: "81000008",
                message: `${Object.values(error?.constraints)?.[0]}`,
                path:
                    arr.length > 0
                        ? arr.join(".") + "." + error.property
                        : error.property,
            });
            return true;
        });
        return formattedErrors;
    })(validationErrors);
};

export const removeTempFile = (filePath: string, logger: bunyan) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            logger.error("FAILED_TO_REMOVE_TEMP_FILE", err);
        }
        logger.info("TEMP_FILE_REMOVED", filePath);
    });
};

export const stateTotalsMapper = (
    stateTotals: { state: string; totalnetgeneration: string }[]
) => {
    const stateTotalsMap: { [state: string]: number } = {};
    stateTotals.forEach((result) => {
        stateTotalsMap[result.state] = parseFloat(
            parseFloat(result.totalnetgeneration).toFixed(2)
        );
    });

    return stateTotalsMap;
};

export const stringifyJSON = <T>(data: T): string => {
    return data ? JSON.stringify(data) : "";
};

export const isRequestDataPrintable = <T>(reqData: T): boolean => {
    return reqData ? true : false;
};

export const shouldAxiosRetry = <T>(error: T): boolean => {
    const { status } = (error as any)?.response || {};
    console.log("custom", env.config.retriesStatuses.includes(status as string), status, env.config.retriesStatuses);
    const isFound = env.config.retriesStatuses.findIndex(item => Number(item) === Number(status));
    if(isFound !== -1) return true;
    return false;
};
