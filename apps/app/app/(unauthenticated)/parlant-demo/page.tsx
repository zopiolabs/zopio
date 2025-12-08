/**
 * SPDX-License-Identifier: MIT
 */

import { ParlantDemoChat } from '@/app/parlant-demo/parlant-chat';

const PublicParlantDemoPage = () => (
  <main className="flex min-h-screen flex-col items-center justify-center p-6">
    <div className="w-full max-w-3xl">
      <ParlantDemoChat />
    </div>
  </main>
);

export default PublicParlantDemoPage;
