export class CurlHelper {
    public static instance: CurlHelper;
    public static generateCommand(config: any, inline: boolean = false): string {
        this.instance = new CurlHelper(config);
        let command =
            `curl -L ${this.instance.getMethod()} '${this.instance.getUrl()}
            ${this.instance.getParams()}' ${this.instance.getHeaders(inline)} ${this.instance.getBody()}`.trim();
        if (inline) {
            command = command.replace(/\s{2,}/g, ' ').replace(/\n/g, '');
        }
        return command;
    }
    public request: any = {
        method: "",
        headers: [],
    }
    constructor(config: any) {
        this.request = config;
    }

    public getHeaders(inline: boolean) {
        let { headers } = this.request;
        if (Object.prototype.hasOwnProperty.call(headers, 'common')) {
            headers = this.request.headers[this.request.method];
        }
        headers = {
            ...headers,
            ...Object
                .entries(this.request.headers)
                .filter(([property, propertyvalue]) => !['common', 'delete', 'get', 'head', 'patch', 'post', 'put']
                    .includes(property) && propertyvalue)
                .map(([property, propertyvalue]) => ({ [property]: propertyvalue }))
                .reduce((current, all) => ({ ...all, ...current }))
        }
        return Object.entries(headers)
            .map(([property, propertyval]) => `${property}:${propertyval}`)
            .reduce((currlHeaders, currentHeader) => `${currlHeaders}
            - H "${currentHeader}" ${inline ? '' : `\\`}`, '').trim();
    }
    public getMethod(): string {
        return `-X ${this.request.method.toUpperCase()}`;
    }

    public getBody() {
        if ((typeof this.request.data !== 'undefined')
            && this.request.data !== ''
            && Object.keys(this.request.data).length
            && this.request.method.toUpperCase() !== 'GET') {
            const data = ((typeof this.request.data === 'object' ||
                Array.isArray(this.request.data)) && (this.request.headers['Content-Type'] !== 'application/octet-stream'))
                ? JSON.stringify(this.request.data, undefined, 4)
                : this.request.data;
            return `-d '${data}'`;
        }
        return "";
    }
    public getUrl(): string {
        return this.request.url.trim();
    }
    public getParams(): string {
        return (this.request.params
            && Object(this.request.params).length > 0)
            ? `${Object.entries(this.request.params)
                .map(([key, val]) => `${key}=${val}`)
                .reduce((all, current) => `${!all.endsWith('?') ? `${all}& ` : `${all}`}${current}`, '?')}` : '';
    }
}