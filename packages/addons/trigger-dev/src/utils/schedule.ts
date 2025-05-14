
import { client } from "../client";

export function scheduleJob(id: string, cron: string, run: () => Promise<void>) {
  return client.defineJob({
    id,
    name: id,
    version: "1.0.0",
    trigger: client.onSchedule({ cron }),
    run,
  });
}
