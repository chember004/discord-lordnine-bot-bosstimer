// index.js
import "dotenv/config"; // loads .env automatically
import fs from "fs";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { fileURLToPath } from "url";

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Command loader
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  // Using default export
  client.commands.set(command.default.data.name, command.default);
}

// Event: client ready
client.on("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event: interaction create
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
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
