import { useCallback, useState } from 'react';
import { createDataProvider } from '@repo/data-providers';

export interface BulkAction<RecordType = any> {
  key: string;
  label: string;
  icon?: string;
  handler: (selectedIds: (string | number)[], selectedRecords: RecordType[]) => Promise<void>;
  confirmMessage?: string;
}

export interface UseTableBulkActionsParams<RecordType = any> {
  resource: string;
  provider?: string;
  providerOptions?: Record<string, any>;
  selectedIds: (string | number)[];
  selectedRecords: RecordType[];
  actions?: BulkAction<RecordType>[];
  onSuccess?: (action: string, result: any) => void;
  onError?: (action: string, error: Error) => void;
}

export interface UseTableBulkActionsReturn<RecordType = any> {
  // Actions
  actions: BulkAction<RecordType>[];
  
  // Execution state
  loading: boolean;
  error: Error | null;
  
  // Execute action
  executeAction: (actionKey: string) => Promise<void>;
  
  // Built-in actions
  deleteSelected: () => Promise<void>;
}

/**
 * Hook for managing bulk actions on selected table rows
 */
export function useTableBulkActions<RecordType = any>({
  resource,
  provider = 'rest',
  providerOptions = {},
  selectedIds,
  selectedRecords,
  actions = [],
  onSuccess,
  onError,
}: UseTableBulkActionsParams<RecordType>): UseTableBulkActionsReturn<RecordType> {
  // Create data provider
  const dataProvider = createDataProvider({
    type: provider as any,
    config: providerOptions,
  });

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Execute action
  const executeAction = useCallback(async (actionKey: string) => {
    const action = actions.find(a => a.key === actionKey);
    
    if (!action) {
      throw new Error(`Action with key ${actionKey} not found`);
    }
    
    if (selectedIds.length === 0) {
      throw new Error('No records selected');
    }
    
    // Confirm if needed
    if (action.confirmMessage) {
      if (!window.confirm(action.confirmMessage)) {
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await action.handler(selectedIds, selectedRecords);
      onSuccess?.(actionKey, { success: true });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(actionKey, error);
    } finally {
      setLoading(false);
    }
  }, [actions, selectedIds, selectedRecords, onSuccess, onError]);

  // Built-in delete action
  const deleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) {
      throw new Error('No records selected');
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected records?`)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Delete records one by one
      await Promise.all(
        selectedIds.map(id =>
          dataProvider.deleteOne({
            resource,
            id,
          })
        )
      );
      
      onSuccess?.('delete', { success: true, count: selectedIds.length });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.('delete', error);
    } finally {
      setLoading(false);
    }
  }, [resource, dataProvider, selectedIds, onSuccess, onError]);

  // Combine custom actions with built-in actions
  const allActions: BulkAction<RecordType>[] = [
    ...actions,
    {
      key: 'delete',
      label: 'Delete',
      icon: 'trash',
      handler: deleteSelected,
      confirmMessage: `Are you sure you want to delete ${selectedIds.length} selected records?`,
    },
  ];

  return {
    actions: allActions,
    loading,
    error,
    executeAction,
    deleteSelected,
  };
}
