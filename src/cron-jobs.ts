import { Client } from "discord.js";
import cron from "node-cron";

import { sendYesNoQuestion } from "./poll-service";

export function scheduleBrunchPoll(client: Client) {
  cron.schedule(
    "0 7 * * 1-5", // At 7:00 AM from Monday to Friday
    async () => {
      await sendYesNoQuestion({
        client: client,
        channelId: process.env.DISCORD_CHANNEL_ID ?? "",
        question: "Good Morning.\nBrunch at the office—Yes or No? 😊",
      });
    },
    { timezone: "Asia/Kathmandu" }
  );
}
