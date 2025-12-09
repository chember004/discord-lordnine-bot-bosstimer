import { SlashCommandBuilder } from "@discordjs/builders";
import { buildEmbed } from "../utils/buildEmbed.js";
import { getNextBoss } from "../utils/nextSpawn.js";

// Command: /boss
export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next upcoming boss");

export async function execute(interaction) {
  try {
    const nextBoss = getNextBoss(); // Automatically finds the next upcoming boss
    await interaction.reply({ embeds: [buildEmbed(nextBoss)] });
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Something went wrong while running that command.",
      ephemeral: true,
    });
  }
}
