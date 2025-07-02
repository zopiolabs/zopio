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
import { createOpenAI } from '@ai-sdk/openai';
import { keys } from '../keys';

const openai = createOpenAI({
  apiKey: keys().OPENAI_API_KEY,
  compatibility: 'strict',
});

export const models = {
  chat: openai('gpt-4o-mini'),
  embeddings: openai('text-embedding-3-small'),
};
