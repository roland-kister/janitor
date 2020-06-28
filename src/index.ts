import Discord from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import { getCommdansCollection, loadConfig } from './init.js';

dotenv.config();

const COMMANDS_DIR = path.join(path.resolve(), './lib/commands/');

const client = new Discord.Client();

const commands = getCommdansCollection();

const config = loadConfig(CONFIG_FILE_PATH);

const prefixRegex = new RegExp(`^${config?.prefix} *(\\w+) *`);

if (!config) {
  console.log(`Config file couldn't be loaded`);

  process.exit(1);
}

client.once('ready', () => {
  console.log('Ready!');

  if (client.user) {
    client.user.setActivity('help', { type: 'LISTENING' });
  }
});

client.on('message', async (message) => {
  const match = prefixRegex.exec(message.content);
  console.log(message.content, match, prefixRegex);
  if (match && !message.author.bot && message.guild != null) {
    const args = message.content.replace(prefixRegex, '').split(/ +/);
    console.log(args);
    if (args.length == 0) {
      message.reply('No args provided');
    }

    const commandName = match[1];

    const command = commands.get(commandName);

    if (!command) {
      message.channel.send('Príkaz nenájdený');
    } else {
      command.execute(message, args).then((reply) => {
        setTimeout(() => {
          reply.delete();
          message.delete();
        }, 60000);
      });
    }
  }
});

client.login(config?.token);
