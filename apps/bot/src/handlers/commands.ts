import type { ChatInputCommandInteraction } from "discord.js";
import { pingCommand } from "../commands/ping.js";

const commands = new Map([[pingCommand.data.name, pingCommand]]);

export async function handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const command = commands.get(interaction.commandName);
  if (!command) {
    await interaction.reply({ content: "That command is not available.", ephemeral: true });
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("Command failed", { command: interaction.commandName, error });
    const response = { content: "The command could not be completed. Please try again later.", ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(response);
    else await interaction.reply(response);
  }
}
