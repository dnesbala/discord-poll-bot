import cron from "node-cron";
import { Client } from "discord.js";

import { sendTextMessage, sendYesNoQuestion } from "./poll-service";
import { checkHoliday } from "./holiday-service";

export function scheduleBrunchPoll(client: Client) {
  cron.schedule(
    "45 7 * * 1-5", // At 7:00 AM from Monday to Friday
    async () => {
      const holiday = checkHoliday();

      if (holiday) {
        await sendTextMessage({
          client: client,
          channelId: process.env.DISCORD_CHANNEL_ID ?? "",
          message: `🎉 Today is ${holiday!.name}. Enjoy your holiday!`,
        });
      } else {
        await sendYesNoQuestion({
          client: client,
          channelId: process.env.DISCORD_CHANNEL_ID ?? "",
          question:
            "Good Morning, @everyone\nBrunch at the office—Yes or No? 🍚",
        });
      }
    },
    { timezone: "Asia/Kathmandu" }
  );
}
