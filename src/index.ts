import Discord from 'discord.js';
import dotenv from 'dotenv';
import { getCommdansCollection, isValidConfig } from './init.js';
import { Database } from './services/Database.js';

dotenv.config();

if (!isValidConfig()) {
  console.log('Invalid config');

  process.exit(1);
}

const client = new Discord.Client();

const commands = getCommdansCollection();

const databaseAdapter = Database.getDatabaseAdapter();

client.once('ready', (): void => {
  console.log('Ready!');

  if (client.user) {
    client.user.setActivity('help', { type: 'LISTENING' });
  }
});

client.on(
  'message',
  async (message): Promise<void> => {
    if (!message.guild || message.author.bot) {
      return;
    }

    let prefix: string | undefined = undefined;

    try {
      prefix = await databaseAdapter.getPrefixForGuild(message.guild.id);
    } catch (e) {
      console.error(e);

      message.channel.send('Neznáma chyba, za ktorú môže môj programátor');

      return;
    }

    if (prefix) {
      prefix = `(?:${prefix}|${process.env.PREFIX})`;
    } else {
      prefix = process.env.PREFIX;
    }

    const prefixRegex = new RegExp(`^${prefix} *(\\w+) *`);

    const match = prefixRegex.exec(message.content);

    if (match) {
      const args = message.content
        .replace(prefixRegex, '')
        .split(/ +/)
        .filter((arg) => arg.length > 0);

      const commandName = match[1];

      const command = commands.get(commandName);

      if (!command) {
        return;
      } else {
        command.execute(message, args).then((reply) => {
          setTimeout(() => {
            try {
              reply.delete();
              message.delete();
            } catch (e) {}
          }, 60000);
        });
      }
    }
  },
);

client.login(process.env.TOKEN);
