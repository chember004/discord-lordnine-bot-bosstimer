import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import { data as bossData, execute as bossExecute } from "./commands/boss.js";

config(); // load .env

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.commands.set(bossData.name, { data: bossData, execute: bossExecute });

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Register slash commands
  await client.application.commands.set([bossData], process.env.GUILD_ID);

  console.log("Slash commands registered.");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (command) await command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);
