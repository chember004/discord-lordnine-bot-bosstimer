// commands/boss.js
import { SlashCommandBuilder } from "discord.js";
import { getNextBoss } from "../utils/nextSpawn.js";
import { buildEmbed } from "../utils/buildEmbed.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Show the next upcoming world boss");

export async function execute(interaction) {
  try {
    const nextBoss = getNextBoss();

    if (!nextBoss) {
      await interaction.reply({
        content: "No upcoming boss found.",
        ephemeral: true,
      });
      return;
    }

    const embed = buildEmbed(nextBoss);
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Something went wrong while running that command.",
      ephemeral: true,
    });
  }
}
