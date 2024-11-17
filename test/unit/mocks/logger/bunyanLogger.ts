export const bunyanLogger = {
    createLogger: jest
        .fn()
        .mockReturnValue({
            child: jest.fn(),
            trace: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            fatal: jest.fn(),
            level: jest.fn(),
        }),
    stdSerializers: { err: jest.fn() },
};