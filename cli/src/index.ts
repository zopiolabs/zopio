import { Command } from "commander";
import { initCommand } from "./init";
import { generateCommand } from "./generate";

export function main() {
  const program = new Command();

  program
    .name("zopio")
    .description("Zopio CLI - Modular B2B Framework Toolkit")
    .version("0.1.0");

  program.addCommand(initCommand);
  program.addCommand(generateCommand);

  program.parse();
}
