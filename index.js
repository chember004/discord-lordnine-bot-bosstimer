import "dotenv/config";
import fs from "fs";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(
      `[WARNING] The command at ${file} is missing "data" or "execute" property.`
    );
  }
}

// Register global commands
async function registerCommands() {
  try {
    const rest = new (await import("@discordjs/rest")).REST({
      version: "10",
    }).setToken(process.env.DISCORD_TOKEN);
    const { Routes } = await import("discord.js");

    const commands = [];
    for (const command of client.commands.values()) {
      commands.push(command.data.toJSON());
    }

    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });
    console.log("✅ Global commands registered.");
  } catch (err) {
    console.error("Failed to register commands:", err);
  }
}

// Event: Bot ready
client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerCommands();
});

// Event: Interaction create
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
        content: "Something went wrong while executing this command.",
        ephemeral: true,
      });
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
