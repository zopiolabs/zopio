/**
 * SPDX-License-Identifier: MIT
 */

import type { BaseModule } from './module.js';

export interface AppModule extends BaseModule {
  type: 'app';
  zopio: {
    category: string;
    icon: string;
    routes: {
      path: string;
      component: string;
      auth?: boolean;
      layout?: string;
    }[];
    navigation?: {
      title: string;
      path: string;
      icon?: string;
      group?: string;
    }[];
    permissions?: string[];
  };
}
