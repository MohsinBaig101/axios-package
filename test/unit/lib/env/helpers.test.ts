import * as path from 'path';
jest.mock('../../../../env', () => ({
    env: {
        config: {
            retriesStatuses: [500, 502, 503],
        },
    },
}));
import { filePath, stringifyJSON, isRequestDataPrintable, shouldAxiosRetry } from '../../../../src/lib/env/helpers';

describe('Utility functions', () => {
    
    describe('filePath', () => {
        it('should return the correct absolute file path', () => {
            const testFilePath = 'test/file.txt';
            const expectedPath = path.join(process.cwd(), testFilePath);
            expect(filePath(testFilePath)).toBe(expectedPath);
        });
    });

    describe('stringifyJSON', () => {
        it('should return a JSON string for a given object', () => {
            const data = { key: 'value' };
            expect(stringifyJSON(data)).toBe('{"key":"value"}');
        });

        it('should return an empty string for null or undefined input', () => {
            expect(stringifyJSON(null)).toBe('');
            expect(stringifyJSON(undefined)).toBe('');
        });
    });

    describe('isRequestDataPrintable', () => {
        it('should return true for truthy values', () => {
            expect(isRequestDataPrintable('data')).toBe(true);
            expect(isRequestDataPrintable(123)).toBe(true);
            expect(isRequestDataPrintable({})).toBe(true);
        });

        it('should return false for falsy values', () => {
            expect(isRequestDataPrintable(null)).toBe(false);
            expect(isRequestDataPrintable(undefined)).toBe(false);
            expect(isRequestDataPrintable(false)).toBe(false);
            expect(isRequestDataPrintable('')).toBe(false);
        });
    });

    describe('shouldAxiosRetry', () => {
        it('should return true for retryable statuses', () => {
            const error = {
                response: {
                    status: 500,
                },
            };
            expect(shouldAxiosRetry(error)).toBe(true);
        });

        it('should return false for non-retryable statuses', () => {
            const error = {
                response: {
                    status: '404',
                },
            };
            expect(shouldAxiosRetry(error)).toBe(false);
        });

        it('should handle missing response or status', () => {
            const error = {};
            expect(shouldAxiosRetry(error)).toBe(false);
        });
    });
});
