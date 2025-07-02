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
import { webhooks } from '@repo/webhooks';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Webhooks',
  description: 'Send webhooks to your users.',
};

const WebhooksPage = async () => {
  const response = await webhooks.getAppPortal();

  if (!response?.url) {
    notFound();
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <iframe
        title="Webhooks"
        src={response.url}
        className="h-full w-full border-none"
        allow="clipboard-write"
        loading="lazy"
      />
    </div>
  );
};

export default WebhooksPage;
