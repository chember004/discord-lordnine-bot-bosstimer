import { SlashCommandBuilder } from "@discordjs/builders";
import {
  getNextNBosses,
  formatDateTime,
  formatCountdown,
} from "../utils/nextSpawn.js";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next upcoming boss.");

export async function execute(interaction) {
  try {
    const [nextBoss] = getNextNBosses(1);

    if (!nextBoss || !nextBoss.nextTime) {
      await interaction.reply("No upcoming boss found.");
      return;
    }

    const embed = {
      title: `🕒 Next Boss — ${nextBoss.name}`,
      color: 0x00ff00,
      fields: [
        { name: "Location", value: nextBoss.location || "Unknown" },
        { name: "Next Spawn", value: formatDateTime(nextBoss.nextTime) },
        { name: "Countdown", value: formatCountdown(nextBoss.nextTime) },
      ],
    };

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.reply("Something went wrong while running that command.");
  }
}
