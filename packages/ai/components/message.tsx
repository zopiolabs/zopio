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
import type { Message as MessageType } from 'ai';
import type { ComponentProps } from 'react';
import Markdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';

type MessageProps = {
  data: MessageType;
  markdown?: ComponentProps<typeof Markdown>;
};

export const Message = ({ data, markdown }: MessageProps) => (
  <div
    className={twMerge(
      'flex max-w-[80%] flex-col gap-2 rounded-xl px-4 py-2',
      data.role === 'user'
        ? 'self-end bg-foreground text-background'
        : 'self-start bg-muted'
    )}
  >
    <Markdown {...markdown}>{data.content}</Markdown>
  </div>
);
