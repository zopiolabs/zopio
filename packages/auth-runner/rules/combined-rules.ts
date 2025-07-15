/**
 * SPDX-License-Identifier: MIT
 */

import { abacRules } from '@repo/auth-abac';
import { rules as rbacRules } from '@repo/auth-rbac';

export const combinedRules = [...rbacRules, ...abacRules];
