/**
 * SPDX-License-Identifier: MIT
 */

import Balancer from 'react-wrap-balancer';

export const Review = () => (
  <section className="flex flex-col gap-8 p-8">
    <div className="flex items-center gap-2 text-neutral-500">
      <small>Developer first</small>
    </div>
    <p className="font-semibold text-xl tracking-tight sm:text-2xl">
      <Balancer>
        &ldquo;A production-grade, monorepo-first, full stack Next.js template.
        Very thoughtfully engineered and documented. Covers auth, DB & ORM,
        webhooks, api, payments, docs, blog, o11y, analytics, emails,
        notifications, triggers, auto-ui, feature flags, dark mode and many
        more..&rdquo;
      </Balancer>
    </p>
  </section>
);
