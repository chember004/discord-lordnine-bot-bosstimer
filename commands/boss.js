import { SlashCommandBuilder } from "@discordjs/builders";
import { getNextBoss } from "../utils/nextSpawn.js";
import { buildEmbed } from "../utils/buildEmbed.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next boss spawn");

export async function execute(interaction) {
  const boss = getNextBoss();
  const embed = buildEmbed(boss);
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
