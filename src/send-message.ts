import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ComponentType,
  TextChannel,
} from "discord.js";

interface SendQuestionParams {
  client: Client;
  channelId: string;
  question: string;
}

export async function sendYesNoQuestion(params: SendQuestionParams) {
  const { client, channelId, question } = params;
  const channel = await client.channels.fetch(channelId);

  if (channel && channel?.isTextBased() && channel.type === 0) {
    const responses: Map<string, { yes: Set<string>; no: Set<string> }> =
      new Map();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("No")
        .setStyle(ButtonStyle.Secondary)
    );

    const pollMessage = await (channel as TextChannel).send({
      content: question,
      components: [row],
    });

    responses.set(pollMessage.id, { yes: new Set(), no: new Set() });

    console.log(responses);

    const collector = pollMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 2 * 60 * 60 * 1000,
    });

    collector.on("collect", async (interaction) => {
      const userId = interaction.user.id;
      const userDisplayName = interaction.user.displayName;
      console.log(userId);

      const pollResponses = responses.get(pollMessage.id);
      if (!pollResponses) return;

      if (interaction.customId === "yes") {
        if (pollResponses.no.has(userId)) {
          pollResponses.no.delete(userId);
        }
        pollResponses.yes.add(userId);
      } else if (interaction.customId === "no") {
        if (pollResponses.yes.has(userId)) {
          pollResponses.yes.delete(userId);
        }
        pollResponses.no.add(userId);
      }

      console.log(pollResponses);

      await interaction.reply({
        content: `Thank you for your response, ${userDisplayName}. You chose - ${interaction.component.label}`,
        ephemeral: true,
      });
    });

    collector.on("end", () => {
      console.log("Poll ended!");
    });
  } else {
    console.error("Failed to fetch channel or invalid channel type.");
  }
}
