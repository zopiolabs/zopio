/**
 * SPDX-License-Identifier: MIT
 */

const __importDefault =
  (this && this.__importDefault) ||
  ((mod) => (mod?.__esModule ? mod : { default: mod }));
Object.defineProperty(exports, '__esModule', { value: true });
exports.fileLogger = undefined;
const node_fs_1 = __importDefault(require('node:fs'));
const logPath = './logs/access.log';
exports.fileLogger = {
  write: (entry) => {
    node_fs_1.default.appendFileSync(logPath, `${JSON.stringify(entry)}\n`);
  },
};
