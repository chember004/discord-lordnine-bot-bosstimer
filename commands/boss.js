import { SlashCommandBuilder } from "discord.js";
import { getNextSpawn } from "../utils/nextSpawn.js";
import { buildEmbed } from "../utils/buildEmbed.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Get the next boss spawn");

export async function execute(interaction) {
  const nextBoss = getNextSpawn();
  const embed = buildEmbed(nextBoss);
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
