import { SlashCommandBuilder } from "discord.js";
import { bosses } from "../data/bosses.js";
import { buildEmbed } from "../utils/buildEmbed.js";
import { getNextSpawn } from "../utils/nextSpawn.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next world boss");

export async function execute(interaction) {
  try {
    const nextBoss = getNextSpawn(bosses);
    const embed = buildEmbed(nextBoss);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "Something went wrong while running that command.",
        ephemeral: true,
      });
    }
  }
}
