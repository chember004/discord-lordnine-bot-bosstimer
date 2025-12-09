import "dotenv/config";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands collection
client.commands = new Collection();

// Load commands dynamically
const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`⚠️ Command ${file} is missing "data" or "execute". Skipped.`);
  }
}

// Bot ready
client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "Something went wrong while running that command.",
        ephemeral: true,
      });
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
