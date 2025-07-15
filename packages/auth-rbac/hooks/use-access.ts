/**
 * SPDX-License-Identifier: MIT
 */

import * as React from 'react';
import useSWR from 'swr';

interface AccessResponse {
  can: boolean;
  reason?: string;
}

/**
 * Hook for checking access permissions
 */
export function useAccess({
  resource,
  action,
  record,
  field,
}: {
  resource: string;
  action: string;
  record?: Record<string, unknown> | null;
  field?: string;
}) {
  // Create a stable key for SWR that includes record ID if available
  const recordId = record && 'id' in record ? String(record.id) : undefined;
  const key = React.useMemo(() => {
    const baseKey = `/api/access?resource=${resource}&action=${action}`;
    const fieldParam = field ? `&field=${field}` : '';
    const recordParam = recordId ? `&recordId=${recordId}` : '';
    return `${baseKey}${fieldParam}${recordParam}`;
  }, [resource, action, field, recordId]);

  // Fetch access data
  const { data, error } = useSWR<AccessResponse>(key);

  return {
    can: data?.can ?? false,
    reason: data?.reason ?? (error ? 'Unknown error' : undefined),
    loading: !data && !error,
  };
}
