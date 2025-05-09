'use client';

const QUEUES_UI_URL =
  process.env.NEXT_PUBLIC_QUEUES_UI_URL || 'http://localhost:4001/admin/queues';

export default function QueuesDashboard() {
  return (
    <iframe
      src={QUEUES_UI_URL}
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  );
}
