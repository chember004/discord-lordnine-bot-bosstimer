import "dotenv/config";
import fs from "fs";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load all command files
const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(
      `[WARNING] Command ${file} is missing "data" or "execute". Skipped.`
    );
  }
}

// Event: ready
client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event: interactionCreate
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "There was an error executing that command.",
        ephemeral: true,
      });
    }
  }
});

// Login
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("DISCORD_TOKEN not found in environment variables!");
  process.exit(1);
}

client.login(TOKEN);
