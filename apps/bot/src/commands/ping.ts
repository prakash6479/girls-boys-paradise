import { SlashCommandBuilder } from "discord.js";

export const pingCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Check whether the community bot is responding."),
  async execute(interaction: import("discord.js").ChatInputCommandInteraction) {
    await interaction.reply({ content: `Pong! Gateway latency: ${interaction.client.ws.ping} ms.`, ephemeral: true });
  },
};
