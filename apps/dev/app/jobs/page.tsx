'use client';

import type { ReactElement } from 'react';

const QUEUES_UI_URL = 'http://localhost:3006/admin/queues';

export default function QueuesDashboard(): ReactElement {
  return (
    <iframe
      src={QUEUES_UI_URL}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Queues Dashboard"
    />
  );
}
