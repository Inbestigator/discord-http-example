import { build } from "@inbestigator/discord-http";
import { writeFileSync } from "fs";

async function genBot() {
  const outputContent = await build(true, false);
  const nodeServer = outputContent
    .replace(
      /discord-http";\n/,
      '$&import { createServer } from "./server.ts";\n',
    )
    .replace(
      /console.warn\(.+\)/,
      "createServer(runCommand, runComponent, config)",
    );
  writeFileSync("./bot.gen.ts", new TextEncoder().encode(nodeServer));
  console.log("✔ Wrote to bot.gen.ts");
}

genBot();
