import dotenv from "dotenv";

import { loginDiscordClient } from "./discord-client";
import { scheduleBrunchPoll } from "./cron-jobs";

dotenv.config();

async function startBot() {
  const client = await loginDiscordClient();
  scheduleBrunchPoll(client);
}

startBot();
