import { SlashCommandBuilder } from "@discordjs/builders";
import {
  getNextNBosses,
  formatDateTime,
  formatCountdown,
} from "../utils/nextSpawn.js";

export const data = new SlashCommandBuilder()
  .setName("bosslist")
  .setDescription("Shows upcoming bosses.")
  .addIntegerOption((option) =>
    option
      .setName("count")
      .setDescription("Number of upcoming bosses to show")
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const count = interaction.options.getInteger("count") || 5;
    const upcomingBosses = getNextNBosses(count);

    if (!upcomingBosses || upcomingBosses.length === 0) {
      await interaction.reply("No upcoming bosses found.");
      return;
    }

    const fields = upcomingBosses.map((boss) => ({
      name: boss.name,
      value: `Location: ${
        boss.location || "Unknown"
      }\nNext Spawn: ${formatDateTime(
        boss.nextTime
      )}\nCountdown: ${formatCountdown(boss.nextTime)}`,
    }));

    const embed = {
      title: `🕒 Upcoming Bosses`,
      color: 0x00ff00,
      fields,
    };

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.reply("Something went wrong while running that command.");
  }
}
