/**
 * SPDX-License-Identifier: MIT
 */

import arcjet, {
  type ArcjetBotCategory,
  type ArcjetWellKnownBot,
  detectBot,
  request,
  shield,
} from '@arcjet/next';
import { log } from '@repo/observability/log';
import { keys } from './keys';

const arcjetKey = keys().ARCJET_KEY;
const isDevelopment = process.env.NODE_ENV === 'development';

export const secure = async (
  allow: (ArcjetWellKnownBot | ArcjetBotCategory)[],
  sourceRequest?: Request
) => {
  if (!arcjetKey) {
    return;
  }

  const base = arcjet({
    // Get your site key from https://app.arcjet.com
    key: arcjetKey,
    // Identify the user by their IP address
    characteristics: ['ip.src'],
    rules: [
      // Protect against common attacks with Arcjet Shield
      shield({
        // Will block requests. Use "DRY_RUN" to log only
        mode: isDevelopment ? 'DRY_RUN' : 'LIVE',
      }),
      // Other rules are added in different routes
    ],
  });

  const req = sourceRequest ?? (await request());
  const aj = base.withRule(
    detectBot({ mode: isDevelopment ? 'DRY_RUN' : 'LIVE', allow })
  );
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    log.warn(`Arcjet decision: ${JSON.stringify(decision.reason, null, 2)}`);

    // In development mode, log but don't block
    if (isDevelopment) {
      log.warn('Arcjet would have blocked this request in production mode');
      return;
    }

    if (decision.reason.isBot()) {
      throw new Error('No bots allowed');
    }

    if (decision.reason.isRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    throw new Error('Access denied');
  }
};
