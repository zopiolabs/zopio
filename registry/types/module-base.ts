/**
 * SPDX-License-Identifier: MIT
 */

export interface ModuleBase {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  entry: string;
  preview?: string;
}
