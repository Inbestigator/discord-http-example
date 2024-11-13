import { MessageComponentInteraction } from "@inbestigator/discord-http";
import { count, setCount, showCount } from "../../commands/counter.ts";

export default async function resetCounter(
  interaction: MessageComponentInteraction,
) {
  setCount(count + 1);

  await interaction.update(showCount(count));
}
