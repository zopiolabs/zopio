/**
 * SPDX-License-Identifier: MIT
 */

import { RichText } from 'basehub/react-rich-text';
import type { FC, ReactElement } from 'react';

// Define a more specific type for the content based on what we know about the structure
type RichTextContent = unknown;

type BodyProps = {
  content: RichTextContent;
  components?: {
    pre?: ({
      code,
      language,
    }: { code: string; language: string }) => ReactElement;
  };
};

// Create a wrapper component that passes the props to RichText
export const Body: FC<BodyProps> = (props) => {
  // We need to use type assertion here because the exact type structure
  // from basehub/react-rich-text is not fully compatible with our props
  return RichText(props as Parameters<typeof RichText>[0]);
};
