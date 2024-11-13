import { build } from "@inbestigator/discord-http";
import { writeFileSync } from "fs";

async function genBot() {
  const outputContent = await build(true, false);
  const nodeServer = outputContent
    .replace(", createServer", "")
    .replace(
      /discord-http";\n/,
      '$&import { createServer } from "./server.ts";\n',
    )
    .replace(
      /if \(config.deno === false\) {\n\s+console.log\("You will need to set up your own server if not on Deno."\);\n\s+} else {\n\s+createServer\(runCommand, runComponent, config\);\n\s+}/,
      "createServer(runCommand, runComponent);",
    );
  writeFileSync("./bot.gen.ts", new TextEncoder().encode(nodeServer));
  console.log("Wrote to bot.gen.ts");
}

genBot();
