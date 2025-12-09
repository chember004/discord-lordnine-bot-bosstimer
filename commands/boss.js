// commands/boss.js
import { SlashCommandBuilder } from "discord.js";
import { getNextSpawn } from "../utils/nextSpawn.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next boss spawn schedule")
  .addStringOption((option) =>
    option.setName("name").setDescription("The boss name").setRequired(true)
  );

export async function execute(interaction) {
  const bossName = interaction.options.getString("name");
  const result = getNextSpawn(bossName);

  if (!result) {
    return interaction.reply({
      content: `❌ Boss **${bossName}** not found.`,
      ephemeral: true,
    });
  }

  return interaction.reply({ embeds: [result], ephemeral: true });
}
