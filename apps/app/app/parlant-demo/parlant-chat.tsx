/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { env } from '@/env';
import ParlantChatbox from 'parlant-chat-react';

const getParlantProxyUrl = () => {
  const apiBaseUrl = env.NEXT_PUBLIC_API_URL;

  if (apiBaseUrl && apiBaseUrl.length > 0) {
    const trimmedBase = apiBaseUrl.endsWith('/')
      ? apiBaseUrl.slice(0, -1)
      : apiBaseUrl;
    return `${trimmedBase}/parlant`;
  }

  return '/parlant';
};

const parlantProxyUrl = getParlantProxyUrl();

export const ParlantDemoChat = () => {
  const agentId = env.NEXT_PUBLIC_PARLANT_AGENT_ID;

  if (!agentId) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed p-6 text-muted-foreground text-sm">
        Parlant agent is not configured. Set{' '}
        <code className="mx-1">NEXT_PUBLIC_PARLANT_AGENT_ID</code> in your
        environment.
      </div>
    );
  }

  return (
    <div className="flex min-h-[500px] flex-col gap-4 rounded-lg border bg-background p-4">
      <div className="space-y-1">
        <h1 className="font-semibold text-xl">Parlant Pilot Chat</h1>
        <p className="text-muted-foreground text-sm">
          This chat widget talks to the Parlant server through the{' '}
          <code>/parlant</code> proxy in <code>apps/api</code>.
        </p>
      </div>
      <div className="flex-1">
        <ParlantChatbox server={parlantProxyUrl} agentId={agentId} />
      </div>
    </div>
  );
};
