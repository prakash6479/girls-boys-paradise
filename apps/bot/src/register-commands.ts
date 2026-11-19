import { REST, Routes } from "discord.js";
import { config } from "./config/env.js";
import { pingCommand } from "./commands/ping.js";

const rest = new REST({ version: "10" }).setToken(config.token);
const body = [pingCommand.data.toJSON()];
const route = config.guildId
  ? Routes.applicationGuildCommands(config.clientId, config.guildId)
  : Routes.applicationCommands(config.clientId);

try {
  await rest.put(route, { body });
  console.info(`Registered ${body.length} slash command(s)${config.guildId ? " for configured guild" : " globally"}.`);
} catch (error) {
  console.error("Slash command registration failed.", error);
  process.exitCode = 1;
}
