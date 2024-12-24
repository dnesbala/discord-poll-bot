import { Client, Events, GatewayIntentBits } from "discord.js";

export async function loginDiscordClient(): Promise<Client> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Bot is online: ${readyClient.user.tag}`);
  });

  await client.login(process.env.DISCORD_TOKEN);

  return client;
}
