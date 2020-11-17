import Discord from 'discord.js';
import { Database } from '../services/Database.js';
import { Command } from '../types/Command.js';

const execute = async (
  message: Discord.Message,
  args: string[],
): Promise<Discord.Message> => {
  const databaseAdapter = Database.getDatabaseAdapter();

  try {
    await databaseAdapter.unsetDefaultDeleteForChannel(message.channel.id);
  } catch (e) {
    console.error(e);

    return message.channel.send(
      'Chyba pri zrušení automatického vymazávania, za ktorú môže môj programátor',
    );
  }

  return message.channel.send('Automatické vymazávanie bolo zrušené');
};

export const unregister: Command = {
  name: 'unregister',
  aliases: [],
  shortDescription: "Zruší predvolenú podmienku pre 'del'",
  description: `\`\`\`js
Použitie príkazu: 'unregister'
Zruší predvolenú podmienku pre 'del' správ pre kanál, ak existuje.
\`\`\``,
  execute,
};
