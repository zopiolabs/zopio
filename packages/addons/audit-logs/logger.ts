import type { AuditLogEntry, AuditLogger } from "./types";

export class ConsoleAuditLogger implements AuditLogger {
  async log(entry: AuditLogEntry): Promise<void> {
    console.log("[AUDIT LOG]", {
      ...entry,
      timestamp: entry.timestamp || new Date()
    });
  }
}

// Future: You can extend with providers such as DB, S3, Supabase, BetterStack etc.
