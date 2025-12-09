import { SlashCommandBuilder } from "@discordjs/builders";
import { getNextNBosses } from "../utils/nextSpawn.js";
import { DateTime, Interval } from "luxon";

export const data = new SlashCommandBuilder()
  .setName("bosslist")
  .setDescription("Shows the next upcoming bosses")
  .addIntegerOption((option) =>
    option
      .setName("count")
      .setDescription("Number of bosses to display")
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const count = interaction.options.getInteger("count") || 3;
    const bosses = getNextNBosses(count);

    if (!bosses.length) {
      return interaction.reply({
        content: "No boss data available.",
        ephemeral: true,
      });
    }

    const now = DateTime.now().setZone("Asia/Manila");

    const fields = bosses.map((boss) => {
      const countdown = Interval.fromDateTimes(now, boss.nextTime).toDuration([
        "hours",
        "minutes",
        "seconds",
      ]);
      const countdownStr = `${Math.floor(countdown.hours)}h ${Math.floor(
        countdown.minutes
      )}m ${Math.floor(countdown.seconds)}s`;

      return {
        name: boss.name,
        value: `📍 Location: ${
          boss.location
        }\n⏰ Spawn: ${boss.nextTime.toFormat(
          "yyyy-LL-dd hh:mm a"
        )}\n⏳ Countdown: ${countdownStr}`,
      };
    });

    await interaction.reply({
      embeds: [
        {
          title: `🕒 Next ${bosses.length} Bosses`,
          color: 0x00ff00,
          fields,
        },
      ],
    });
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Something went wrong while running that command.",
      ephemeral: true,
    });
  }
}
