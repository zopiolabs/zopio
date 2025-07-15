/**
 * SPDX-License-Identifier: MIT
 */

import type { ModuleBase } from './module-base';

export type ZopioModuleType =
  | 'plugin'
  | 'integration'
  | 'app'
  | 'template'
  | 'tool';

export interface ZopioModuleManifest extends ModuleBase {
  type: ZopioModuleType;
}
