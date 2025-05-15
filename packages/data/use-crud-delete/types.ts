export interface UseCrudDeleteOptions {
  resource: string;
  id: string;
  meta?: Record<string, any>;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

export interface UseCrudDeleteReturn {
  deleteItem: () => Promise<void>;
  deleting: boolean;
  error?: Error;
}
