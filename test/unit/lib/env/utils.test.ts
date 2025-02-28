import * as utils from '../../../../src/lib/env/utils';
import { join } from 'path';

describe('Utility Functions', () => {
  
  beforeEach(() => {
    process.env = {}; // Reset process.env before each test
  });

  describe('getOsEnv', () => {
    it('should return the value of an environment variable', () => {
      process.env.TEST_KEY = 'test_value';
      expect(utils.getOsEnv('TEST_KEY')).toBe('test_value');
    });

    it('should return undefined if the environment variable is not set', () => {
      expect(utils.getOsEnv('NON_EXISTENT_KEY')).toBeUndefined();
    });
  });

  describe('getOsEnvNumber', () => {
    it('should return a number parsed from the environment variable', () => {
      process.env.TEST_KEY = '42';
      expect(utils.getOsEnvNumber('TEST_KEY')).toBe(42);
    });

    it('should return NaN if the environment variable is not a valid number', () => {
      process.env.TEST_KEY = 'abc';
      expect(utils.getOsEnvNumber('TEST_KEY')).toBeNaN();
    });
  });

  describe('getOsEnvArray', () => {
    it('should return an array split by the default delimiter', () => {
      process.env.TEST_KEY = 'a,b,c';
      expect(utils.getOsEnvArray('TEST_KEY')).toEqual(['a', 'b', 'c']);
    });

    it('should return an empty array if the environment variable is not set', () => {
      expect(utils.getOsEnvArray('NON_EXISTENT_KEY')).toEqual([]);
    });

    it('should split the value using a custom delimiter', () => {
      process.env.TEST_KEY = 'x|y|z';
      expect(utils.getOsEnvArray('TEST_KEY', '|')).toEqual(['x', 'y', 'z']);
    });
  });

  describe('getOsEnvBoolean', () => {
    it('should return true for "true" (case insensitive)', () => {
      process.env.TEST_KEY = 'true';
      expect(utils.getOsEnvBoolean('TEST_KEY')).toBe(true);
    });

    it('should return false for "false" (case insensitive)', () => {
      process.env.TEST_KEY = 'false';
      expect(utils.getOsEnvBoolean('TEST_KEY')).toBe(false);
    });

    it('should return the default value if the environment variable is not set', () => {
      expect(utils.getOsEnvBoolean('NON_EXISTENT_KEY', 'true')).toBe(true);
    });

    it('should return false for an empty string', () => {
      process.env.TEST_KEY = '';
      expect(utils.getOsEnvBoolean('TEST_KEY')).toBe(false);
    });
  });

  describe('toBool', () => {
    it('should return true for "true" (case insensitive)', () => {
      expect(utils.toBool('true')).toBe(true);
      expect(utils.toBool('TRUE')).toBe(true);
    });

    it('should return false for "false" (case insensitive)', () => {
      expect(utils.toBool('false')).toBe(false);
      expect(utils.toBool('FALSE')).toBe(false);
    });

    it('should return false for any other value', () => {
      expect(utils.toBool('random')).toBe(false);
      expect(utils.toBool('')).toBe(false);
    });
  });

  describe('getPath', () => {
    it('should return a modified path in production mode', () => {
      process.env.NODE_ENV = 'production';
      const mockCwd = '/mock/cwd';
      jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

      expect(utils.getPath('src/file.ts')).toBe(join(mockCwd, 'dist/file.js'));
    });

    it('should return the same path in non-production mode', () => {
      process.env.NODE_ENV = 'development';
      const mockCwd = '/mock/cwd';
      jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

      expect(utils.getPath('src/file.ts')).toBe(join(mockCwd, 'src/file.ts'));
    });
  });

  describe('getPaths', () => {
    it('should transform an array of paths correctly', () => {
      process.env.NODE_ENV = 'production';
      const mockCwd = '/mock/cwd';
      jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

      expect(utils.getPaths(['src/file1.ts', 'src/file2.ts'])).toEqual([
        join(mockCwd, 'dist/file1.js'),
        join(mockCwd, 'dist/file2.js'),
      ]);
    });
  });

  describe('getOsPaths', () => {
    it('should return an array of transformed paths from an environment variable', () => {
      process.env.NODE_ENV = 'production';
      process.env.TEST_KEY = 'src/file1.ts,src/file2.ts';

      const mockCwd = '/mock/cwd';
      jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

      expect(utils.getOsPaths('TEST_KEY')).toEqual([
        join(mockCwd, 'dist/file1.js'),
        join(mockCwd, 'dist/file2.js'),
      ]);
    });

    it('should return an empty array if the environment variable is not set', () => {
      expect(utils.getOsPaths('NON_EXISTENT_KEY')).toEqual([]);
    });
  });

});
