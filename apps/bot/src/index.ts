import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config/env.js";
import { handleCommand } from "./handlers/commands.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.info(`Bot connected as ${readyClient.user.tag}. Guild-member and message features are not enabled in this foundation build.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) await handleCommand(interaction);
});

client.on(Events.Error, (error) => console.error("Discord client error", error));

process.once("SIGINT", () => { client.destroy(); process.exit(0); });
process.once("SIGTERM", () => { client.destroy(); process.exit(0); });

client.login(config.token).catch((error: unknown) => {
  console.error("Discord login failed. Verify the bot token and network access.", error);
  process.exitCode = 1;
});
