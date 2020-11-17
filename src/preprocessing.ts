import Discord from 'discord.js';
import { parseToken } from './commands/delete.js';
import { Database } from './services/Database.js';

export const matchAndParseCommand = async (
  message: Discord.Message,
): Promise<{ name: string; args: string[] } | null> => {
  if (!message.guild || message.author.bot) {
    return null;
  }

  let prefix: string | undefined = undefined;

  try {
    prefix = await Database.getDatabaseAdapter().getPrefixForGuild(
      message.guild.id,
    );
  } catch (e) {
    console.error(e);

    message.channel.send('Neznáma chyba, za ktorú môže môj programátor');

    return null;
  }

  if (prefix) {
    prefix = `(?:${prefix}|${process.env.PREFIX})`;
  } else {
    prefix = process.env.PREFIX;
  }

  const prefixRegex = new RegExp(`^${prefix} *(\\w+) *`);

  const match = prefixRegex.exec(message.content);

  if (!match) {
    return null;
  }

  return {
    name: match[1],
    args: message.content
      .replace(prefixRegex, '')
      .split(/ +/)
      .filter((arg) => arg.length > 0),
  };
};

export const isWatchDelete = async (
  message: Discord.Message,
): Promise<boolean> => {
  if (!message.guild) {
    return false;
  }

  let watchDel: string | undefined = undefined;

  try {
    watchDel = await Database.getDatabaseAdapter().getWatchDeleteForChannel(
      message.channel.id,
    );
  } catch (e) {
    console.error(e);

    message.channel.send('Neznáma chyba, za ktorú môže môj programátor');

    return false;
  }

  if (!watchDel) {
    return false;
  }

  const token = parseToken(watchDel.split(' '));

  if (token.execute(message)) {
    return true;
  }

  return false;
};
