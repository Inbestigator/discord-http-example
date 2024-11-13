import {
  ActionRow,
  MessageComponentInteraction,
} from "@inbestigator/discord-http";
import { triviaData } from "../../commands/trivia";

export default async function resetCounter(
  interaction: MessageComponentInteraction,
  { answer }: { answer: string },
) {
  let userId;

  if ("member" in interaction && interaction.member) {
    userId = interaction.member.user.id;
  } else if ("user" in interaction && interaction.user) {
    userId = interaction.user.id;
  }

  if (!userId) {
    await interaction.reply("I'm not sure who you are.");
    return;
  }

  const question = triviaData[userId];

  const updatedButtons = interaction.message.components![0].components.map(
    (button) => ({
      ...button,
      style: (button as { label: string }).label ===
          (question as { correct_answer: string }).correct_answer
        ? 3
        : 4,
      disabled: true,
    }),
  );

  if (
    (question as { correct_answer: string }).correct_answer
      .toLowerCase()
      .replace(/[^a-z]/g, "_") !== answer
  ) {
    await interaction.update({
      content: `## Nice try!\n${interaction.message.content.split("\n")[1]}`,
      components: [ActionRow(...updatedButtons)],
    });
    return;
  }

  await interaction.update({
    content: `## Correct!\n${interaction.message.content.split("\n")[1]}`,
    components: [ActionRow(...updatedButtons)],
  });
}
