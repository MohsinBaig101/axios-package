import moment from "moment";
import * as _ from "lodash";
import { env } from "../../../env";
import { isRequestDataPrintable, stringifyJSON } from '../env/helpers';

export const processRequest = async ({ req, logger, startTime, axios, retryCount }) => {
    try {
        const headersForLog: any = {
            'Client-Timestamp': req?.headers['Client-Timestamp']
        };
        logger.info({
            ...headersForLog,
            ...((req.data && (Object.keys(req.data).length > 0) && env.log.debugMode && isRequestDataPrintable(req.data)) ? { data: req.data } : {}),
            url: req?.url,
            maxContentLength: req.maxContentLength,
            retryCount,
            type: 'EXTERNAL_REQUEST'
        },
            'process Request payload');
        const { headers: responseHeaders, data, status } = await axios(req);
        const { location, version } = responseHeaders;
        const printData = stringifyJSON(data).length < 25000 && (req?.headers['Content-Type'] !== 'application/octet-stream');
        logger.info({
            type: 'EXTERNAL_RESPONSE',
            status: 'pass',
            statusCode: status,
            responseLocation: location,
            responseTime: moment().diff(moment(startTime)),
            retryCount,
            ...((env.log.debugMode && printData) ? { data } : {}),
        }, 'External API call passed');
        return Promise.resolve({
            location,
            data,
            version,
            headers: responseHeaders,
            success: true
        });
    } catch (err: any) {
        const hasApiFailed = true;
        const status = (err.isAxiosError && err.response) ? _.get(err, 'response.status') : 500;
        const error = _.get(err, 'response.data') || _.get(err, 'message', 'Failed');
        const { name: errorName, message: errorMessage, stack } = err;
        logger.error({
            type: 'EXTERNAL_RESPONSE',
            status: 'FAIL',
            statusCode: status,
            retryCount,
            error: {
                name: errorName,
                message: errorMessage,
                error: stringifyJSON(error),
                ...((!env.isProduction) ? { stack } : {})
            },
            responseTime: moment().diff(moment(startTime))
        }, 'External API call failed');
        err = undefined;
        return Promise.resolve({ status, error, hasApiFailed });
    }
}