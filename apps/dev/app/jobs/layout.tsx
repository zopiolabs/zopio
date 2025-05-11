import type { ReactNode } from 'react';

export default function JobsLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <div className="h-full w-full">{children}</div>;
}
