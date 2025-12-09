import { buildEmbed } from "../utils/buildEmbed.js";
import { getNextSpawn } from "../utils/nextSpawn.js";
import { bosses } from "../data/bosses.js";

export default {
  data: {
    name: "boss",
    description: "Shows the next boss spawn",
  },
  async execute(interaction) {
    try {
      const nextBoss = getNextSpawn(bosses); // your function
      await interaction.deferReply(); // defer first
      await interaction.editReply({ embeds: [buildEmbed(nextBoss)] }); // then edit
    } catch (err) {
      console.error(err);
      if (!interaction.replied) {
        await interaction.reply({
          content: "Error fetching boss info.",
          ephemeral: true,
        });
      }
    }
  },
};
