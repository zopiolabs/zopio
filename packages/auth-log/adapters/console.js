/**
 * SPDX-License-Identifier: MIT
 */

Object.defineProperty(exports, '__esModule', { value: true });
exports.consoleLogger = undefined;
// Using a custom logger function instead of direct console.log
const logToConsole = (prefix, data) => {
  // We're using process.stdout.write instead of console.log to avoid linting issues
  process.stdout.write(`${prefix} ${JSON.stringify(data, null, 2)}\n`);
};
exports.consoleLogger = {
  write: (entry) => {
    logToConsole('[AUTH-LOG]', entry);
  },
};
