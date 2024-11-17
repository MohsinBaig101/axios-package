const tsc = require("typescript");
const tsconfig = require("../tsconfig.json");

module.exports = {
    process(src, path) {
        if (path.endsWith('.ts') || path.endsWith('.tsx')) {
            return { code: tsc.transpile(src, tsconfig.compilerOptions, path, []) }
        }
        return { code: src }
    }
}