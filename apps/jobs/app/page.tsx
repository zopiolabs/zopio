'use client';

import type { ReactElement } from 'react';

const JOBS_UI_URL =
  process.env.NEXT_PUBLIC_JOBS_UI_URL || 'http://localhost:4001/admin/jobs';

export default function JobsDashboard(): ReactElement {
  return (
    <iframe
      src={JOBS_UI_URL}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Jobs Dashboard"
    />
  );
}
