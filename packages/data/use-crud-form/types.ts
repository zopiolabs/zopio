export interface UseCrudFormOptions {
  resource: string;
  id?: string;
  action: "create" | "edit";
  defaultValues?: Record<string, any>;
  meta?: Record<string, any>;
}

export interface UseCrudFormReturn {
  form: Record<string, any>;
  setForm: (v: Record<string, any>) => void;
  loading: boolean;
  submitting: boolean;
  error?: Error;
  handleSubmit: () => Promise<void>;
}
