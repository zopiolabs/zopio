/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
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
