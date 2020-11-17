import Discord from 'discord.js';
import dotenv from 'dotenv';
import { getCommdansCollection, isValidConfig } from './init.js';
import { isWatchDelete, matchAndParseCommand } from './preprocessing.js';
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
    client.user.setActivity(`${process.env.PREFIX}help`, { type: 'LISTENING' });
  }
});

client.on(
  'message',
  async (message): Promise<void> => {
    const com = await matchAndParseCommand(message);

    if (com) {
      const command = commands.get(com.name);

      if (!command) {
        return;
      } else {
        command.execute(message, com.args).then((reply) => {
          setTimeout(() => {
            try {
              reply.delete();
              message.delete();
            } catch (e) {
              console.error(e);
            }
          }, 15000);
        });
      }
    }

    if (await isWatchDelete(message)) {
      setTimeout(() => {
        try {
          message.delete();
        } catch (e) {
          console.error(e);
        }
      }, 30000);
    }
  },
);

client.login(process.env.TOKEN);
