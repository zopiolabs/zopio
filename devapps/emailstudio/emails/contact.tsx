/**
 * SPDX-License-Identifier: MIT
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
