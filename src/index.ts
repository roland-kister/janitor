import Discord from 'discord.js';
import path from 'path';
import { getCommdansCollection, loadConfig } from './init.js';

const CONFIG_FILE_PATH = './config/config.yaml';
const COMMANDS_DIR = path.join(path.resolve(), './lib/commands/');

const client = new Discord.Client();

const commands = getCommdansCollection();

const config = loadConfig(CONFIG_FILE_PATH);

if (!config) {
  console.log(`Config file couldn't be loaded`);

  process.exit(1);
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  if (
    message.content.startsWith(config.prefix) &&
    !message.author.bot &&
    message.guild != null
  ) {
    const args = message.content.slice(config.prefix.length).split(/ +/);

    if (args.length == 0) {
      message.reply('No args provided');
    }

    const commandName = (args.shift() as string).toLowerCase();

    const command = commands.get(commandName);

    if (!command) {
      message.channel.send('Príkaz nenájdený');
    } else {
      command.execute(message, args).then((reply) => {
        setTimeout(() => {
          reply.delete();
          message.delete();
        }, 5000);
      });
    }
  }
});

client.login(config?.token);
