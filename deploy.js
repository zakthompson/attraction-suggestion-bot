import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

const commands = [];
// Grab all the command folders from the commands directory
const foldersPath = path.join(import.meta.dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    console.log(command.default);
    if ('data' in command.default && 'execute' in command.default) {
      commands.push(command.default.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy commands!
try {
  console.log(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  // And of course, make sure you catch and log any errors!
  console.error(error);
}
