import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ComponentType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";

interface SendQuestionParams {
  client: Client;
  channelId: string;
  question: string;
}

const responses: Map<string, { yes: Set<string>; no: Set<string> }> = new Map();

export async function sendYesNoQuestion(params: SendQuestionParams) {
  const { client, channelId, question } = params;
  const channel = await client.channels.fetch(channelId);

  if (channel && channel?.isTextBased() && channel.type === 0) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("✅ Yes")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("❌ No")
        .setStyle(ButtonStyle.Secondary)
    );

    const pollMessage = await (channel as TextChannel).send({
      content: question,
      components: [row],
    });

    responses.set(pollMessage.id, { yes: new Set(), no: new Set() });

    const collector = pollMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 2 * 60 * 60 * 1000, // after 2 hours
    });

    collector.on("collect", async (interaction) => {
      const userId = interaction.user.id;
      const userDisplayName = interaction.user.displayName;

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

      await interaction.reply({
        content: `Thank you for your response, ${userDisplayName}. You chose - ${interaction.component.label}`,
        ephemeral: true,
      });
    });

    collector.on("end", () => {
      displayPollResponses(pollMessage.id, client, channelId);
    });
  } else {
    console.error("Failed to fetch channel or invalid channel type.");
  }
}

export async function displayPollResponses(
  pollMessageId: string,
  client: Client,
  channelId: string
) {
  const pollResponses = responses.get(pollMessageId);

  if (!pollResponses) {
    console.error("No responses found for the given poll message ID.");
    return;
  }

  const { yes, no } = pollResponses;

  const getUserDisplayNames = async (
    userIds: Set<string>
  ): Promise<string[]> => {
    const names: string[] = [];
    for (const userId of userIds) {
      try {
        const user = await client.users.fetch(userId);
        names.push(user.displayName);
      } catch (error) {
        console.error(`Failed to fetch user with ID ${userId}:`, error);
      }
    }
    return names;
  };

  const yesUsers = await getUserDisplayNames(yes);
  const noUsers = await getUserDisplayNames(no);

  const embed = new EmbedBuilder()
    .setTitle("📊 Poll Results")
    .setDescription("Here are the final results of the poll:")
    .setColor(0x00aaff)
    .addFields(
      {
        name: `✅ Yes (${yes.size})`,
        value: yesUsers.length > 0 ? yesUsers.join(", ") : "No responses.",
        inline: true,
      },
      {
        name: `❌ No (${no.size})`,
        value: noUsers.length > 0 ? noUsers.join(", ") : "No responses.",
        inline: true,
      }
    )
    .setFooter({ text: "Thanks for your response!" })
    .setTimestamp();

  const channel = await client.channels.fetch(channelId);

  if (channel && channel?.isTextBased() && channel.type === 0) {
    (channel as TextChannel).send({ embeds: [embed] });
  } else {
    console.error("Failed to fetch channel or invalid channel type.");
  }
}
