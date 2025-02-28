import { Logger } from '../../../../../src/lib/logger/Logger';
import { env } from '../../../../../env';

describe('Logger', () => {
    let logger;

    beforeEach(() => {
        logger = new Logger('testLogger');
    });

    test('should create a logger instance', () => {
        expect(logger).toBeDefined();
        expect(logger).toHaveProperty('logger');
    });

    test('should create a child logger', () => {
        const childLogger = logger.child({ module: 'test' });
        expect(childLogger).toBeDefined();
        expect(childLogger.fields).toHaveProperty('module', 'test');
    });

    test('should log messages at different levels', () => {
        const spy = jest.spyOn(logger["logger"], 'info');
        logger.info('Test info message');
        expect(spy).toHaveBeenCalledWith(undefined, 'Test info message');
        spy.mockRestore();
    });

    test('should log error messages', () => {
        const spy = jest.spyOn(logger["logger"], 'error');
        const error = new Error('Test error');
        logger.error(error);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    test('should merge error objects correctly', () => {
        const error = new Error('Test merge error');
        const additional = { context: 'unit-test' };
        const merged = logger._merge(error, additional);
        expect(merged).toHaveProperty('err');
        expect(merged.err).toHaveProperty('message', 'Test merge error');
        expect(merged).toHaveProperty('context', 'unit-test');
    });

    test('should log infoDebug messages when debug mode is enabled', () => {
        env.log.debugMode = true;
        const spy = jest.spyOn(logger["logger"], 'info');
        logger.infoDebug('Debug message');
        expect(spy).toHaveBeenCalledWith(undefined, 'Debug message');
        spy.mockRestore();
    });

    test('should not log infoDebug messages when debug mode is disabled', () => {
        env.log.debugMode = false;
        const spy = jest.spyOn(logger["logger"], 'info');
        logger.infoDebug('Debug message');
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});