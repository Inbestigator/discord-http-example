import { MessageComponentInteraction } from "@inbestigator/discord-http";
import { setCount, showCount } from "../../commands/counter.ts";

export default async function resetCounter(
  interaction: MessageComponentInteraction,
) {
  setCount(0);

  await interaction.update(showCount(0));

  await interaction.followUp({
    content: "Counter has been reset!",
    ephemeral: true,
  });
}
