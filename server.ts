import {
  CommandInteraction,
  MessageComponentInteraction,
  ModalSubmitInteraction,
  runInteraction,
  verifySignature,
} from "@inbestigator/discord-http";
import express from "express";

export function createServer(
  runCommand: (interaction: CommandInteraction) => Promise<void>,
  runComponent: (
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
  ) => Promise<void>,
) {
  const app = express();
  app.use(express.json());
  const port = 8000;

  app.post("/", async (req, res) => {
    const sigReq = {
      headers: {
        get: (name: string) => {
          return req.headers[name.toLowerCase()];
        },
      },
      text: () => JSON.stringify(req.body),
    };

    if (!(await verifySignature(sigReq as unknown as Request))) {
      console.error(" └ Invalid signature");
      res.send(null).status(401);
      return;
    }

    const intReq = {
      json: () => req.body,
    };

    try {
      const response = await runInteraction(
        runCommand,
        runComponent,
        intReq as unknown as Request,
      );

      const { status } = response;
      if (status === 200) {
        res.json({ type: 1 });
      }
      res.status(status);
    } catch (error) {
      console.error(" └ Error processing request:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
