import { Client, Events, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import dotenv from "dotenv";

import { sendYesNoQuestion } from "./poll-service";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot is online: ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

cron.schedule(
  "0 7 * * 1-5", // At 7:00 AM from Monday to Friday
  async () => {
    await sendYesNoQuestion({
      client: client,
      channelId: "840044499483885573",
      question: "Good Morning.\nBrunch at the office—Yes or No? 😊",
    });
  },
  { timezone: "Asia/Kathmandu" }
);
