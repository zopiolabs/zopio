import { useState, useCallback, useMemo } from 'react';

export interface UseTableSelectionParams<RecordType = any> {
  data: RecordType[];
  idField?: keyof RecordType;
  initialSelected?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

export interface UseTableSelectionReturn<RecordType = any> {
  // Selected IDs
  selectedIds: (string | number)[];
  
  // Selected records
  selectedRecords: RecordType[];
  
  // Selection state
  isAllSelected: boolean;
  isSomeSelected: boolean;
  
  // Selection operations
  selectAll: () => void;
  deselectAll: () => void;
  toggleSelectAll: () => void;
  selectOne: (id: string | number) => void;
  deselectOne: (id: string | number) => void;
  toggleSelectOne: (id: string | number) => void;
  isSelected: (id: string | number) => boolean;
}

/**
 * Hook for managing table row selection
 */
export function useTableSelection<RecordType = any>({
  data,
  idField = 'id' as keyof RecordType,
  initialSelected = [],
  onSelectionChange,
}: UseTableSelectionParams<RecordType>): UseTableSelectionReturn<RecordType> {
  // Selected IDs state
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>(initialSelected);
  
  // Get all IDs from data
  const allIds = useMemo(() => {
    return data.map(item => item[idField] as string | number);
  }, [data, idField]);
  
  // Selection state
  const isAllSelected = useMemo(() => {
    return allIds.length > 0 && selectedIds.length === allIds.length;
  }, [allIds, selectedIds]);
  
  const isSomeSelected = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length < allIds.length;
  }, [allIds, selectedIds]);
  
  // Get selected records
  const selectedRecords = useMemo(() => {
    return data.filter(item => selectedIds.includes(item[idField] as string | number));
  }, [data, selectedIds, idField]);
  
  // Selection operations
  const selectAll = useCallback(() => {
    setSelectedIds(allIds);
    onSelectionChange?.(allIds);
  }, [allIds, onSelectionChange]);
  
  const deselectAll = useCallback(() => {
    setSelectedIds([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);
  
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [isAllSelected, selectAll, deselectAll]);
  
  const selectOne = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev;
      }
      const newSelection = [...prev, id];
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);
  
  const deselectOne = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      if (!prev.includes(id)) {
        return prev;
      }
      const newSelection = prev.filter(item => item !== id);
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);
  
  const toggleSelectOne = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);
  
  const isSelected = useCallback((id: string | number) => {
    return selectedIds.includes(id);
  }, [selectedIds]);
  
  return {
    selectedIds,
    selectedRecords,
    isAllSelected,
    isSomeSelected,
    selectAll,
    deselectAll,
    toggleSelectAll,
    selectOne,
    deselectOne,
    toggleSelectOne,
    isSelected,
  };
}
