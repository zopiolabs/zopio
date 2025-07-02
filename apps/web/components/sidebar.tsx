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
import { capitalize } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

type SidebarProperties = {
  readonly date: Date;
  readonly readingTime: string;
  readonly tags?: string[];
  readonly toc?: ReactNode;
};

export const Sidebar = async ({
  date,
  readingTime,
  tags,
  toc: Toc,
}: SidebarProperties) => (
  <div className="col-span-4 flex w-72 flex-col items-start gap-8 border-foreground/10 border-l px-6 lg:col-span-2">
    <div className="grid gap-2">
      <p className="text-muted-foreground text-sm">Published</p>
      <p className="rounded-sm text-foreground text-sm">
        {new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'America/New_York',
        }).format(date)}
      </p>
    </div>
    <div className="grid gap-2">
      <p className="text-muted-foreground text-sm">Reading Time</p>
      <p className="rounded-sm text-foreground text-sm">{readingTime}</p>
    </div>
    {tags && (
      <div className="grid gap-2">
        <p className="text-muted-foreground text-sm">Tags</p>
        <p className="rounded-sm text-foreground text-sm">
          {tags.map(capitalize).join(', ')}
        </p>
      </div>
    )}
    {Toc ? (
      <div className="-mx-2">
        <div className="grid gap-2 p-2">
          <p className="text-muted-foreground text-sm">Sections</p>
          {Toc}
        </div>
      </div>
    ) : undefined}
  </div>
);
