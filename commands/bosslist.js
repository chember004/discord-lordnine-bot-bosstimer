// commands/bosslist.js
import { SlashCommandBuilder } from "discord.js";
import { getNextNBosses } from "../utils/nextSpawn.js";
import { buildEmbed } from "../utils/buildEmbed.js";

export const data = new SlashCommandBuilder()
  .setName("bosslist")
  .setDescription(
    "Show a list of upcoming world bosses with their spawn time and location"
  )
  .addIntegerOption((option) =>
    option
      .setName("count")
      .setDescription("Number of upcoming bosses to display")
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const count = interaction.options.getInteger("count") || 5;
    const bosses = getNextNBosses(count);

    if (!bosses || bosses.length === 0) {
      await interaction.reply({
        content: "No upcoming bosses found.",
        ephemeral: true,
      });
      return;
    }

    // Build a single embed with multiple fields
    const embed = {
      title: `🗡 Upcoming ${bosses.length} Bosses`,
      color: 0x00ff00,
      fields: bosses.map((b) => {
        const countdown = Math.floor((b.nextTime - new Date()) / 1000);
        const hours = Math.floor(countdown / 3600);
        const minutes = Math.floor((countdown % 3600) / 60);
        const seconds = countdown % 60;
        const countdownStr = `${hours}h ${minutes}m ${seconds}s`;

        return {
          name: b.name,
          value: `📍 ${b.location}\n🕒 ${b.nextTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}\n⏱ Countdown: ${countdownStr}`,
          inline: false,
        };
      }),
      footer: { text: "LordNine Boss Timer" },
    };

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Something went wrong while running that command.",
      ephemeral: true,
    });
  }
}
