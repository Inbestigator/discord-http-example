import {
  ActionRow,
  MessageComponentInteraction,
} from "@inbestigator/discord-http";
const kv = await Deno.openKv();

export default async function resetCounter(
  interaction: MessageComponentInteraction,
  { answer }: { answer: string },
) {
  const question = (await kv.get(["trivia", interaction.user.id])).value;

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
