import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  MessageFlags,
} from 'discord.js';

dotenv.config();
const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

// Handle available commands
client.commands = new Collection();

const foldersPath = path.join(import.meta.dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command.default && 'execute' in command.default) {
      client.commands.set(command.default.data.name, command.default);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Register available events
const eventsPath = path.join(import.meta.dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = await import(filePath);
  if (event.default.once) {
    client.once(event.default.name, (...args) =>
      event.default.execute(...args)
    );
  } else {
    client.on(event.default.name, (...args) => event.default.execute(...args));
  }
}

client.login(token);
