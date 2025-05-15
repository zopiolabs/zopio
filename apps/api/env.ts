import { keys as analytics } from '@repo/addons/analytics/keys';
import { keys as auth } from '@repo/core/auth/keys';
import { keys as database } from '@repo/core/database/keys';
import { keys as email } from '@repo/core/email/keys';
import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/addons/observability/keys';
import { keys as payments } from '@repo/core/payments/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [
    auth(),
    analytics(),
    core(),
    database(),
    email(),
    observability(),
    payments(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
