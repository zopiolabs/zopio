/**
 * SPDX-License-Identifier: MIT
 */

import type { AccessLogEntry } from '../types';
interface BetterStackOptions {
  sourceToken: string;
  endpoint?: string;
}
export declare function createBetterStackLogger(options: BetterStackOptions): {
  write: (entry: AccessLogEntry) => Promise<void>;
};
//# sourceMappingURL=betterstack.d.ts.map
