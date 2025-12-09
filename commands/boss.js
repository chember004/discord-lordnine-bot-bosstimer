import { SlashCommandBuilder } from "discord.js";
import { bosses } from "../data/bosses.js";
import { buildEmbed } from "../utils/buildEmbed.js";
import { getNextBosses } from "../utils/nextSpawn.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next boss(es) to spawn")
  .addIntegerOption((option) =>
    option
      .setName("count")
      .setDescription("Number of upcoming bosses to display")
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const count = interaction.options.getInteger("count");
    const nextBosses = getNextBosses(count || 1);

    if ((count || 1) === 1) {
      await interaction.reply({
        embeds: [buildEmbed(nextBosses[0])],
        ephemeral: true,
      });
    } else {
      for (const boss of nextBosses) {
        await interaction.followUp({
          embeds: [buildEmbed(boss)],
          ephemeral: true,
        });
      }
    }
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Something went wrong while running that command.",
      ephemeral: true,
    });
  }
}
