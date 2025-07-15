/**
 * SPDX-License-Identifier: MIT
 */

import { getDictionary } from './index';

export default async function fetchDictionary(locale: string) {
  return await getDictionary(locale);
}
