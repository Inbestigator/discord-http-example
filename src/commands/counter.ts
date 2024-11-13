import {
  ActionRow,
  Button,
  type CommandConfig,
  type CommandInteraction,
} from "@inbestigator/discord-http";

export let count = 0;

export function setCount(newCount: number) {
  count = newCount;
}

export const config: CommandConfig = {
  description: "Increments a counter",
};

export default async function counter(interaction: CommandInteraction) {
  count++;

  await interaction.reply({
    content: showCount(count),
    ephemeral: true,
    components: [
      ActionRow(
        Button({
          label: "Add",
          custom_id: "add_counter",
        }),
        Button({
          label: "Reset",
          style: "Danger",
          custom_id: "reset_counter",
        }),
      ),
    ],
  });
}

export function showCount(count: unknown) {
  return `I've been run ${count} time${count == 1 ? "" : "s"}!`;
}
