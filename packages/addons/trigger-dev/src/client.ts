
import { TriggerClient } from "@trigger.dev/sdk";

// Export a shared client instance
export const client = new TriggerClient({ id: "zopio", apiKey: process.env.TRIGGER_API_KEY! });
