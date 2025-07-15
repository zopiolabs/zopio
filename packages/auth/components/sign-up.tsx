/**
 * SPDX-License-Identifier: MIT
 */

import { SignUp as ClerkSignUp } from '@clerk/nextjs';
import type { FC } from 'react';

export const SignUp: FC = () => (
  <ClerkSignUp
    appearance={{
      elements: {
        header: 'hidden',
      },
    }}
  />
);
