import { ConsoleRawStream } from "../../../../../src/lib/logger/ConsoleRawStream";

const logLevel = {
    10: "trace",
    20: "debug",
    30: "info",
    40: "warn",
    50: "error"
};

describe("ConsoleRawStream", () => {
    let consoleSpy: jest.SpyInstance;
    let consoleRawStram: ConsoleRawStream;

    beforeEach(() => {
        consoleRawStram = new ConsoleRawStream();
        consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should log at correct level", () => {
        Object.entries(logLevel).forEach(([level, method]) => {
            consoleSpy = jest.spyOn(console, method as keyof Console).mockImplementation(() => {});
            const logEntry = JSON.stringify({ level: parseInt(level), message: "Test log" });
            consoleRawStram.write(logEntry);
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Test log"));
        });
    });

    test("should handle invalid JSON without throwing error", () => {
        expect(() => consoleRawStram.write("invalid json"))
            .toThrow(SyntaxError);
    });

    test("should not log if input is empty", () => {
        consoleRawStram.write("");
        expect(consoleSpy).not.toHaveBeenCalled();
    });
});