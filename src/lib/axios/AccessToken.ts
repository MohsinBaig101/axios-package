// import * as http from "http";
// import * as https from "https";
// import * as _ from "lodash";
// import * as oauth from "simple-oauth2";
// import moment from "moment";
// // import { env } from "../env";
// import { Logger } from "../logger";

// const log = new Logger(__filename);

// export interface TokenConfig {
//     clientId: string;
//     clientSecret: string;
//     host: string;
//     path: string;
// }

// export class AccessToken {
//     private config;
//     private oAuthClient;
//     private token;

//     constructor(config: TokenConfig) {
//         this.config = config && config.clientId && config;
//     }
//     public async get(): Promise<string> {
//         const token = await this.getToken();
//         return token && token.access_token;
//     }
//     private async getToken(): Promise<any> {
//         if (this.token) {
//             if (this.isAccessTokenExpired()) {
//                 if (this.isRefreshTokenExpired()) {
//                     this.reset();
//                 } else {
//                     await this.refresh();
//                 }
//             }
//         }
//         if (!this.token) {
//             try {
//                 const client = this.getOAuthClient();
//                 const token = await client.clientCredentials.getToken();
//                 this.token = this.updateExpiry(token);
//             } catch (err: any) {
//                 log.error(`Error while creating token, ${err && err.message}`);
//             }
//         }
//         return this.token;
//     }
//     private reset(): void {
//         this.oAuthClient = undefined;
//         this.token = undefined;
//     }

//     private async refresh(): Promise<any> {
//         try {
//             const client = this.getOAuthClient();
//             const { token } = await client.accessToken.create(this.token).refresh();
//             this.token = this.updateExpiry(token);
//         } catch (err: any) {
//             log.error(`Error while refreshing token, ${err && err.message}`);
//             this.reset();
//         }
//     }

//     private isAccessTokenExpired(): boolean {
//         return moment.now() > this.token.expiresAt;
//     }
//     private isRefreshTokenExpired(): boolean {
//         return moment.now() > this.token.refreshExpiresAt;
//     }
//     private updateExpiry(token: any): any {
//         const { expires_in, refresh_expires_in } = token;
//         const expiresAt = moment().add(expires_in - env.oAuth.tokenExpiresBefore, 'seconds');
//         const refreshExpiresAt = moment().add(expires_in + refresh_expires_in - env.oAuth.refreshTokenExpiresBefore, 'seconds');
//         return Object.assign({}, token, { expiresAt, refreshExpiresAt });
//     }
//     private getOAuthClient():any {
//         const agent = new https.Agent({
//             rejectUnauthorized: false,
//         });
//         if(!this.oAuthClient){
//             const authConfigData = {
//                 client: {
//                     id: this.config.clientId,
//                     secret: this.config.clientSecret,
//                 },
//                 auth: {
//                     tokenHost: this.config.host,
//                     tokenPath: this.config.path,
//                 },
//                 http: {
//                     agents: {
//                         https: agent,
//                         http: new http.Agent(),
//                         httpsAllowUnauthorized: new https.Agent()
//                     }
//                 }
//             }
//             this.oAuthClient = oauth.create(authConfigData);
//         }
//         return this.oAuthClient;
//     }
// }