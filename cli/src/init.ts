import { Command } from "commander";
import fs from "fs";
import path from "path";

export const initCommand = new Command("init")
  .description("Initialize a new zopio project")
  .action(() => {
    const cwd = process.cwd();
    const pkg = path.join(cwd, "package.json");
    if (fs.existsSync(pkg)) {
      console.log("A project already exists here.");
      return;
    }
    fs.writeFileSync(pkg, JSON.stringify({ name: "zopio-app", version: "0.1.0" }, null, 2));
    console.log("✅ Initialized zopio project.");
  });
