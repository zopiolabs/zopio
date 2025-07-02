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
import { renderView } from './renderers/renderView';
import type { ViewSchema } from './renderers/types';
import views from './views.json';

(views as ViewSchema[]).forEach((view, index) => {
  console.log(`\n[View ${index + 1}]`);
  console.log(renderView(view));
});
