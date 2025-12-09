import { SlashCommandBuilder } from "@discordjs/builders";
import { bosses } from "../data/bosses.js";
import { buildEmbed } from "../utils/buildEmbed.js";
import { getNextNBosses } from "../utils/nextSpawn.js";

// Command: /bosslist
export const data = new SlashCommandBuilder()
  .setName("bosslist")
  .setDescription("Shows a list of upcoming bosses")
  .addIntegerOption((option) =>
    option
      .setName("count")
      .setDescription("Number of upcoming bosses to display")
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction) {
  try {
    const count = interaction.options.getInteger("count");
    const nextBosses = getNextNBosses(count); // Returns an array of next N bosses

    const embeds = nextBosses.map((boss) => buildEmbed(boss));
    await interaction.reply({ embeds, ephemeral: false });
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Something went wrong while running that command.",
      ephemeral: true,
    });
  }
}
