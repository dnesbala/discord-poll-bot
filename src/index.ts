import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot is online: ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
