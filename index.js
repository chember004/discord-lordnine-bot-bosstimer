import { Client, GatewayIntentBits, Collection } from "discord.js";
import * as bossCommand from "./commands/boss.js";
import { config } from "./config.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command collection
client.commands = new Collection();
client.commands.set(bossCommand.data.name, bossCommand);

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    // Clear old guild commands first
    await client.application.commands.set([], config.guildId);
    console.log("Old commands cleared.");

    // Register latest commands for your guild
    await client.application.commands.set([bossCommand.data], config.guildId);
    console.log("Slash commands registered successfully.");
  } catch (err) {
    console.error("Error registering commands:", err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error("Error executing command:", err);
    await interaction.reply({
      content: "There was an error executing this command.",
      ephemeral: true,
    });
  }
});

// Login to Discord
client.login(config.token);
