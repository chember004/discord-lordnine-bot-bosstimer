import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Required for working with __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const TOKEN = process.env.DISCORD_TOKEN;
const TIMEZONE = process.env.TIMEZONE || "Asia/Manila";

if (!TOKEN) {
  console.error("❌ Missing DISCORD_TOKEN in .env");
  process.exit(1);
}

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Load commands from /commands folder
client.commands = new Collection();
const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);

  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ Command ${file} is missing "data" or "execute". Skipped.`);
  }
}

// Register GLOBAL slash commands
async function registerCommands() {
  try {
    const RESTclient = new REST({ version: "10" }).setToken(TOKEN);

    console.log(
      "🌍 Registering global slash commands... (This may take up to 1 hour to propagate)"
    );

    await RESTclient.put(
      Routes.applicationCommands(client.user.id), // GLOBAL, NO GUILD NEEDED
      { body: commands }
    );

    console.log("✅ Global slash commands registered.");
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
  }
}

// When bot is ready
client.once("clientReady", async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  await registerCommands();
});

// When user triggers a slash command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, TIMEZONE);
  } catch (error) {
    console.error("❌ Command execution error:", error);

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: "⚠️ Something went wrong while running that command.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "⚠️ Something went wrong while running that command.",
        ephemeral: true,
      });
    }
  }
});

// Login bot
client.login(TOKEN);
