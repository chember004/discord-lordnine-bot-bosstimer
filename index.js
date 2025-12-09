// index.js
import "dotenv/config";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands dynamically
const commandsPath = path.join("./commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { data, execute } = await import(filePath);
  if (data && execute) {
    client.commands.set(data.name, { data, execute });
  } else {
    console.warn(`⚠️ Command ${file} is missing "data" or "execute". Skipped.`);
  }
}

// Event: ready
client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event: interaction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      await interaction.reply({
        content: "There was an error executing this command.",
        ephemeral: true,
      });
    }
  }
});

// Login with token
client.login(process.env.DISCORD_TOKEN);
