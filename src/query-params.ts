import { Client } from "discord.js";

export interface SendQuestionParams {
  client: Client;
  channelId: string;
  question: string;
}

export interface DisplayMessageParams {
  client: Client;
  channelId: string;
  message: string;
}
