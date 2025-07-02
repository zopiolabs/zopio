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
