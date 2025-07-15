/**
 * SPDX-License-Identifier: MIT
 */

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
// Import React for JSX support
import type * as React from 'react';

/**
 * Props for the ContactTemplate component
 */
interface ContactTemplateProps {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

/**
 * Email template for contact form submissions
 */
const ContactTemplate = (props: ContactTemplateProps): React.ReactElement => {
  const { name, email, message } = props;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>New email from {name}</Preview>
        <Body className="bg-zinc-50 font-sans">
          <Container className="mx-auto py-12">
            <Section className="mt-8 rounded-md bg-zinc-200 p-px">
              <Section className="rounded-[5px] bg-white p-8">
                <Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
                  New email from {name}
                </Text>
                <Text className="m-0 text-zinc-500">
                  {name} ({email}) has sent you a message:
                </Text>
                <Hr className="my-4" />
                <Text className="m-0 text-zinc-500">{message}</Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

// Add preview props for email testing
ContactTemplate.PreviewProps = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  message: "I'm interested in your services.",
};

// Export the component
export { ContactTemplate };

export default ContactTemplate;
