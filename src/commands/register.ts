import Discord from 'discord.js';
import { Database } from '../services/Database.js';
import { Command } from '../types/Command.js';
import { parseToken } from './delete.js';

const execute = async (
  message: Discord.Message,
  args: string[],
): Promise<Discord.Message> => {
  const command = args.join(' ');

  if (args.length === 0) {
    return message.channel.send(
      "Uveď podmienku, podobne ako pri príkaze 'del'",
    );
  }

  try {
    parseToken(args);
  } catch (e) {
    return message.channel.send(e.message);
  }

  const databaseAdapter = Database.getDatabaseAdapter();

  try {
    await databaseAdapter.setDefaultDeleteForChannel(
      message.channel.id,
      command,
    );
  } catch (e) {
    console.error(e);

    return message.channel.send(
      "Chyba pri nastavovaní predvoleného 'del' príkazu, za ktorú môže môj programátor",
    );
  }

  return message.channel.send(
    `Predvolený \'del\' príkaz nastavený na '${command}'`,
  );
};

export const register: Command = {
  name: 'register',
  aliases: ['r'],
  shortDescription: "Zaregistruje predvolenú podmienku pre 'del'",
  description: `\`\`\`js
Použitie príkazu: 'register [del podmienka]'
Zaregistruje predvolenú podmienku pre 'del' príkaz. Následne je možné používať 'del' bez parametrov.
Pre viac informácií o 'del podmienka' použi príkaz 'help del'
\`\`\``,
  execute,
};
