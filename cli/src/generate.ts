import { Command } from "commander";
import fs from "fs";
import path from "path";

export const generateCommand = new Command("generate")
  .description("Generate a new zopio module")
  .argument("type", "core | addon | data")
  .argument("name", "module name")
  .action((type, name) => {
    const base = `packages/${type}/${name}`;
    if (fs.existsSync(base)) {
      console.log("Module already exists.");
      return;
    }
    fs.mkdirSync(base, { recursive: true });
    fs.writeFileSync(
      path.join(base, "index.ts"),
      `// ${name} module for ${type}\nexport const ${name} = () => console.log("${name} module");\n`
    );
    console.log(`✅ Created ${type}/${name}`);
  });
