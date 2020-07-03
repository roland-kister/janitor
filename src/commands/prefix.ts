import { Guild, Message } from 'discord.js';
import { Database } from '../services/Database.js';
import { Command } from '../types/Command.js';
import { escapeRegExp } from '../util.js';

const execute = async (message: Message, args: string[]): Promise<Message> => {
  if (args.length === 0) {
    return message.channel.send('Uveď prefix, ktorý chceš nastaviť');
  } else if (args.length > 1) {
    return message.channel.send('Prefix musí byť jedno slovo alebo emote');
  }

  const databaseAdapter = Database.getDatabaseAdapter();

  const prefix = args[0];

  try {
    await databaseAdapter.setPrefixForGuild(
      (message.guild as Guild).id,
      escapeRegExp(prefix),
    );
  } catch (e) {
    console.error(e);

    return message.channel.send(
      'Chyba pri nastavovaní prefix-u, za ktorú môže môj programátor',
    );
  }

  return message.channel.send(`Prefix úspešne nastavený na ${prefix}`);
};

export const setPrefix: Command = {
  name: 'prefix',
  aliases: 'p',
  shortDescription: 'Nastaví prefix bota, napr. `set-prefix -`',
  description: `Nastaví prefix bota pre server, napr. \`set-prex -\`. Prefix môže byť jedno slovo alebo emote.`,
  execute,
};
