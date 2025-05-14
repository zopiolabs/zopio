
import { client } from "../client";

client.defineJob({
  id: "log-hello",
  name: "Log Hello World",
  version: "1.0.0",
  trigger: client.onSchedule({ cron: "0 * * * *" }),
  run: async () => {
    console.log("Hello from Trigger.dev!");
  },
});
