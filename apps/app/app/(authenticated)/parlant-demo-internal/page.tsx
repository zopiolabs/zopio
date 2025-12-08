/**
 * SPDX-License-Identifier: MIT
 */

import { ParlantDemoChat } from '@/app/parlant-demo/parlant-chat';

const AuthenticatedParlantDemoPage = () => (
  <main className="flex flex-1 flex-col gap-6 p-6">
    <ParlantDemoChat />
  </main>
);

export default AuthenticatedParlantDemoPage;
