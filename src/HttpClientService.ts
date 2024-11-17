import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import * as https from 'https';
import * as _ from 'lodash';
import moment from 'moment';
import { Logger } from "./lib/logger";
import { InitializeInterceptors } from './lib/axios/requestInterceptor';
import { env } from '../env';
import { processRequest } from './lib/axios/processRequest';
import {
    shouldAxiosRetry
} from './lib/env/helpers';
import { HttpMethod, RequestHeaders } from './interfaces/HttpClient';


InitializeInterceptors(axios);
axiosRetry(axios, {
    retries: env.config.retries,
    retryDelay: (retryCount: number) => {
        return retryCount * env.config.retryDelay;
    },
    retryCondition: shouldAxiosRetry
});

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});
export class HttpClientService {
    private url: string;
    private accessToken: string;
    private log: Logger;

    constructor(serviceDetails: {
        host: string,
        path: string,
        c2bToken: string
    }) {
        const { host, path, c2bToken } = serviceDetails;
        // const { host, path, oAuth } = serviceDetails;
        this.url = `${host}${path}`;
        // this.accessToken = new AccessToken(oAuth);
        this.accessToken = c2bToken;
        this.log = new Logger(__filename);
    }

    public get(path: string, headers: RequestHeaders, params = {}, responseType: string = 'json', options = {}): Promise<any> {
        return this.request('GET', path, headers, {
            params,
            responseType,
            ...options,
        })
    }
    public post(path: string, headers: RequestHeaders, data = {}, options = {}): Promise<any> {
        return this.request('POST', path, headers, {
            data,
            ...options,
        });
    }

    public put(path: string, headers: RequestHeaders, data = {}, options = {}): Promise<any> {
        return this.request('PUT', path, headers, {
            data,
            ...options,
        });
    }

    public patch(path: string, headers: RequestHeaders, data = {}, options = {}): Promise<any> {
        return this.request('PATCH', path, headers, {
            data,
            ...options,
        });
    }

    public delete(path: string, headers: RequestHeaders, data = {}, options = {}): Promise<any> {
        return this.request('DELETE', path, headers, {
            data,
            ...options,
        });
    }

    private async request(method: HttpMethod, path: string, headers: RequestHeaders, { ...args }: any): Promise<any> {
        const url = `${this.url}${path}`;
        // const accessToken = await this.accessToken.get();
        const Authorization = `Bearer ${this.accessToken}`
        const requestHeaders = {
            Authorization,
            ...headers,
            ...this.getHeaders({ xSignature: headers?.xSignature }),
        };
        const { data: requestData = {}, additionalHeaders = {}, ...restArgs } = args;
        const startTime = moment.now();
        const logger = this.log.child({
            instanceType: 'HTTP_CLIENT_REQUEST',
            urc: headers?.urc
        });
        const req: AxiosRequestConfig = {
            url,
            method,
            headers: { ...requestHeaders },
            ...((Object.keys(requestData).length > 0) ? { data: requestData } : {}),
            maxContentLength: env.config.maxContentLength,
            maxBodyLength: env.config.maxBodyLength,
            httpsAgent,
            logger: this.log,
            count: 0,
            // oAuthObj: this.accessToken.config,
            ...restArgs,
            timeout: env.config.timeout,
            timeOutErrorMessage: env.config.timeoutErrorMessage,
        };
        return processRequest({ req, logger, startTime, axios, retryCount: 0 })
    }

    private getHeaders({ xSignature }) {
        return {
            ...(xSignature) ? { 'X-Signature': xSignature } : {}
        }
    }
}