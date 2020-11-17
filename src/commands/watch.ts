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

  try {
    await Database.getDatabaseAdapter().setWatchDeleteForChannel(
      message.channel.id,
      command,
    );
  } catch (e) {
    console.error(e);

    return message.channel.send(
      'Chyba pri nastavovaní automatického vymazávania, za ktorú môže môj programátor',
    );
  }

  return message.channel.send(
    `Automatické vymazávanie nastavené na podmienku '${command}'`,
  );
};

export const watch: Command = {
  name: 'watch',
  aliases: ['w'],
  shortDescription: 'Zaregistruje podmienku pre automatické vymazávanie',
  description: `\`\`\`js
Použitie príkazu: 'watch [del podmienka]'
Zaregistruje predvolenú podmienku, ktorá bude overovaná na každej správe v nastavenom kanáli. Ak je podmienka splnená, po 30 sekundách bude správa vymazaná.
Pre viac informácií o 'del podmienka' použi príkaz 'help del'
\`\`\``,
  execute,
};
