import type { AuditLogger, AuditLogEntry } from "./types";

export class BetterStackAuditLogger implements AuditLogger {
  private readonly apiKey: string;
  private readonly sourceToken: string;

  constructor({ apiKey, sourceToken }: { apiKey: string; sourceToken: string }) {
    this.apiKey = apiKey;
    this.sourceToken = sourceToken;
  }

  async log(entry: AuditLogEntry): Promise<void> {
    const logEntry = {
      timestamp: (entry.timestamp || new Date()).toISOString(),
      level: "info",
      message: `${entry.action} on ${entry.resource}`,
      context: {
        ...entry,
        timestamp: undefined // remove duplicate field
      }
    };

    await fetch("https://in.logs.betterstack.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.sourceToken}`
      },
      body: JSON.stringify(logEntry)
    });
  }
}
