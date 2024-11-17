import sinon, { SinonSandbox } from "sinon";
import { HttpClientService } from "../../src/HttpClientService";
import * as AxiosProcess from "../../src/lib/axios/processRequest";
import { bunyanLogger } from "./mocks/logger/bunyanLogger";
jest.mock("bunyan", () => bunyanLogger);
describe("HttpClientService test suit", () => {
    let httpClient: HttpClientService;
    let sinonSandbox: SinonSandbox;
    beforeAll(() => {
        httpClient = new HttpClientService({
            host: "localhost",
            path: "/path",
            c2bToken: "dummy token",
        });
        sinonSandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sinonSandbox.restore();
    });

    test("http client Get method", () => {
        const fnMock = sinonSandbox
            .stub(AxiosProcess, "processRequest")
            .returns(new Promise((resolve, reject) => resolve));
        httpClient.get("http://localhost", { headers: {} });
        expect(fnMock.callCount).toBe(1);
    });

    test("http client post method", () => {
        const fnMock = sinonSandbox
            .stub(AxiosProcess, "processRequest")
            .returns(new Promise((resolve, reject) => resolve));
        httpClient.post("http://localhost", { headers: {} }, {});
        expect(fnMock.callCount).toBe(1);
    });

    test("http client delete method", () => {
        const fnMock = sinonSandbox
            .stub(AxiosProcess, "processRequest")
            .returns(new Promise((resolve, reject) => resolve));
        httpClient.delete("http://localhost", { headers: {} }, {});
        expect(fnMock.callCount).toBe(1);
    });

    test("http client put method", () => {
        const fnMock = sinonSandbox
            .stub(AxiosProcess, "processRequest")
            .returns(new Promise((resolve, reject) => resolve));
        httpClient.put("http://localhost", { headers: {} }, {});
        expect(fnMock.callCount).toBe(1);
    });

    test("http client patch method", () => {
        const fnMock = sinonSandbox
            .stub(AxiosProcess, "processRequest")
            .returns(new Promise((resolve, reject) => resolve));
        httpClient.patch("http://localhost", { headers: {} }, {});
        expect(fnMock.callCount).toBe(1);
    });
});
