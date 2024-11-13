This is a simple NodeJS example for a bot made with
[Discord-http](https://jsr.io/@inbestigator/discord-http).

## Getting Started

First, build the bot:

```bash
pnpm install
pnpm build
```

The custom `build.ts` script _should_ automatically fix the `bot.gen.ts` output
to use the simple Express solution for Node in `server.ts`.

In order to obtain a public url to use as the interactions endpoint for Discord,
you need to forward a port, personally, I use VSCode's public port forward
system

If you aren't using VSCode, Cloudflared tunnel is a good option.

You can try editing your bot by modifying `src/commands/greet.ts`.

## Deploying

When you're ready, you can try to deploy the bot with Deno deploy:

```bash
pnpm build
deployctl deploy --entrypoint=bot.gen.ts
```

You can check out
[the GitHub repository](https://github.com/inbestigator/discord-http) - your
feedback and contributions are welcome!
