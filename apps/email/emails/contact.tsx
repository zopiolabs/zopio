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
import { ContactTemplate } from '@repo/email/templates/contact';
import type { ReactElement } from 'react';

// Using explicit type annotation to fix TS2742 error
const ExampleContactEmail = (): ReactElement => (
  <ContactTemplate
    name="Jane Smith"
    email="jane.smith@example.com"
    message="I'm interested in your services."
  />
);

export default ExampleContactEmail;
