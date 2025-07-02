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
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Page from '../app/(unauthenticated)/sign-up/[[...sign-up]]/page';

test('Sign Up Page', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Create an account',
    })
  ).toBeDefined();
});
