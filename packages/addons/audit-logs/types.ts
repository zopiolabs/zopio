export type AuditLogAction = "create" | "read" | "update" | "delete" | string;

export interface AuditLogEntry {
  id?: string;
  resource: string;
  action: AuditLogAction;
  data?: Record<string, any>;
  previousData?: Record<string, any>;
  timestamp?: Date;
  user?: {
    id: string;
    email?: string;
  };
  meta?: Record<string, any>;
}

export interface AuditLogger {
  log: (entry: AuditLogEntry) => Promise<void>;
}
