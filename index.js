import "dotenv/config";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { buildEmbed } from "./utils/buildEmbed.js";
import { getNextBosses } from "./utils/nextSpawn.js";
import { data as bossData, execute as bossExecute } from "./commands/boss.js";
import { execute as bossListExecute } from "./commands/bosslist.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Slash commands collection
client.commands = new Collection();
client.commands.set("boss", bossExecute);
client.commands.set("bosslist", bossListExecute);

// Ready event
client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Interaction handling
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const commandName = interaction.commandName;

  try {
    if (commandName === "boss") {
      await bossExecute(interaction);
    } else if (commandName === "bosslist") {
      await bossListExecute(interaction);
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Something went wrong while running that command.",
        ephemeral: true,
      });
    }
  }
});

// Login using token from .env
client.login(process.env.DISCORD_TOKEN);
