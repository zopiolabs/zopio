/**
 * SPDX-License-Identifier: MIT
 */

import { SignIn as ClerkSignIn } from '@clerk/nextjs';
import type { FC } from 'react';

export const SignIn: FC = () => (
  <ClerkSignIn
    appearance={{
      elements: {
        header: 'hidden',
      },
    }}
  />
);
