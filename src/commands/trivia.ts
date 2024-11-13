import {
  ActionRow,
  Button,
  type CommandConfig,
  type CommandInteraction,
} from "@inbestigator/discord-http";
import entities from "./entities.json" with { type: "json" };

export const triviaData: Record<string, object> = {};

function decodeHTMLEntities(text: string): string {
  return text.replace(/&(#\d+|#x[0-9a-fA-F]+|\w+);/g, (match, code) => {
    if (match in entities) {
      return (entities as Record<string, string>)[match];
    } else if (code.startsWith("#x")) {
      return String.fromCharCode(parseInt(code.slice(2), 16));
    } else if (code.startsWith("#")) {
      return String.fromCharCode(parseInt(code.slice(1), 10));
    }
    return match;
  });
}

export const config: CommandConfig = {
  description: "Gives a random trivia question",
};

export default async function counter(interaction: CommandInteraction) {
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

  await interaction.deferReply({
    ephemeral: true,
  });
  const question = await fetch(
    "https://opentdb.com/api.php?amount=1&difficulty=easy",
  );

  const data = await question.json();

  if (data.response_code === 5) {
    await interaction.editReply({
      content: "You're regenerating too fast! Try again in a few seconds.",
    });
    return;
  }

  triviaData[userId] = data.results[0];

  const answers = data.results[0].incorrect_answers.concat(
    data.results[0].correct_answer,
  );

  const buttons = answers
    .sort(() => Math.random() - 0.5)
    .map((answer: string) =>
      Button({
        label: answer,
        custom_id: `guess_${answer.toLowerCase().replace(/[^a-z]/g, "_")}`,
      })
    );

  await interaction.editReply({
    content: `## Trivia!\n${decodeHTMLEntities(data.results[0].question)}`,
    components: [ActionRow(...buttons)],
  });
}
