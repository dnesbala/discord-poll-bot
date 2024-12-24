import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { sendYesNoQuestion } from "./send-message";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot is online: ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

setTimeout(async () => {
  await sendYesNoQuestion({
    client: client,
    channelId: "840044499483885573",
    question: "Good Morning. Brunch at the office—Yes or No? 😊",
  });
}, 5000);
