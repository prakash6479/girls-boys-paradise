import { config as loadDotEnv } from "dotenv";
import { resolve } from "node:path";

loadDotEnv({ path: resolve(process.cwd(), "../../.env") });

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  token: required("DISCORD_BOT_TOKEN"),
  clientId: required("DISCORD_CLIENT_ID"),
  guildId: process.env.DISCORD_GUILD_ID?.trim(),
  apiBaseUrl: process.env.API_BASE_URL?.replace(/\/$/, ""),
  apiSecret: process.env.BOT_API_SECRET,
};
