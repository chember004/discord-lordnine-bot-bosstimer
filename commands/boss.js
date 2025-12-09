import { SlashCommandBuilder } from "discord.js";
import { getNextBoss } from "../utils/nextSpawn.js";
import { buildEmbed } from "../utils/buildEmbed.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next boss spawn time");

export async function execute(interaction) {
  const nextBoss = getNextBoss();
  await interaction.reply({ embeds: [buildEmbed(nextBoss)] });
}
