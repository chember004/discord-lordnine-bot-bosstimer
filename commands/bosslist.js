import { SlashCommandBuilder } from "@discordjs/builders";
import { getNextNBosses } from "../utils/nextSpawn.js";
import { buildEmbed } from "../utils/buildEmbed.js";

export const data = new SlashCommandBuilder()
  .setName("bosslist")
  .setDescription("Shows upcoming N bosses")
  .addIntegerOption((option) =>
    option
      .setName("count")
      .setDescription("Number of upcoming bosses")
      .setRequired(false)
  );

export async function execute(interaction) {
  const count = interaction.options.getInteger("count") || 3;
  const bosses = getNextNBosses(count);
  const embeds = bosses.map((b) => buildEmbed(b));
  await interaction.reply({ embeds, ephemeral: true });
}
