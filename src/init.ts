import Discord from 'discord.js';
import { del } from './commands/delete.js';
import { help } from './commands/help.js';
import { setPrefix } from './commands/prefix.js';
import { Command } from './types/Command.js';

export const isValidConfig = (): boolean => {
  console.log(process.env.DATABASE_URL);
  if (!process.env.TOKEN || !process.env.PREFIX || !process.env.DATABASE_URL) {
    return false;
  }

  return true;
};

export const getCommdansCollection = (): Discord.Collection<
  string,
  Command
> => {
  const collection = new Discord.Collection<string, Command>();

  collection.set(help.name, help);
  collection.set(del.name, del);
  collection.set(setPrefix.name, setPrefix);

  return collection;
};
