export interface UseCrudShowOptions {
  resource: string;
  id: string;
  meta?: Record<string, any>;
}

export interface UseCrudShowReturn {
  data?: Record<string, any>;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}
