import Discord from 'discord.js';
import { Database } from '../services/Database.js';
import { Command } from '../types/Command.js';

const execute = async (
  message: Discord.Message,
  args: string[],
): Promise<Discord.Message> => {
  const databaseAdapter = Database.getDatabaseAdapter();

  try {
    await databaseAdapter.unsetWatchDeleteForChannel(message.channel.id);
  } catch (e) {
    console.error(e);

    return message.channel.send(
      'Chyba pri zrušení automatického vymazávania, za ktorú môže môj programátor',
    );
  }

  return message.channel.send('Automatické vymazávanie bolo zrušené');
};

export const unwatch: Command = {
  name: 'unwatch',
  aliases: [],
  shortDescription: 'Zruší podmienku pre automatické vymazávanie',
  description: `\`\`\`js
Použitie príkazu: 'unwatch'
Zruší podmienku pre automatické vymazávanie správ pre kanál, ak existuje.
\`\`\``,
  execute,
};
