import { SlashCommandBuilder } from "@discordjs/builders";
import { getNextBoss } from "../utils/nextSpawn.js";
import { DateTime, Interval } from "luxon";

export const data = new SlashCommandBuilder()
  .setName("boss")
  .setDescription("Shows the next upcoming boss");

export async function execute(interaction) {
  try {
    const boss = getNextBoss();
    if (!boss) {
      return interaction.reply({
        content: "No boss data available.",
        ephemeral: true,
      });
    }

    const now = DateTime.now().setZone("Asia/Manila");
    const countdown = Interval.fromDateTimes(now, boss.nextTime).toDuration([
      "hours",
      "minutes",
      "seconds",
    ]);

    const countdownStr = `${Math.floor(countdown.hours)}h ${Math.floor(
      countdown.minutes
    )}m ${Math.floor(countdown.seconds)}s`;

    await interaction.reply({
      embeds: [
        {
          title: `🕒 Next Boss — ${boss.name}`,
          color: 0x00ff00,
          fields: [
            { name: "Location", value: boss.location, inline: true },
            {
              name: "Spawn Time",
              value: boss.nextTime.toFormat("yyyy-LL-dd hh:mm a"),
              inline: true,
            },
            { name: "Countdown", value: countdownStr, inline: true },
          ],
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
