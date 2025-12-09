import "dotenv/config";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// Load all commands from commands folder
const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { data, execute } = await import(`file://${filePath}`);
  if (!data || !execute) {
    console.warn(`⚠️ Command ${file} is missing "data" or "execute". Skipped.`);
    continue;
  }
  client.commands.set(data.name, { data, execute });
}

// Register commands globally
client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const commands = client.commands.map((cmd) => cmd.data.toJSON());
    await client.application.commands.set(commands);
    console.log("Slash commands registered globally.");
  } catch (err) {
    console.error("Failed to register commands:", err);
  }
});

// Handle slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Something went wrong.",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
