import Discord from 'discord.js';
import { del } from './commands/delete.js';
import { help } from './commands/help.js';
import { setPrefix } from './commands/prefix.js';
import { Command } from './types/Command.js';

export const isValidConfig = (): boolean => {
  if (
    !process.env.prefix ||
    !process.env.token ||
    !process.env.db_user ||
    !process.env.db_password ||
    !process.env.db_name ||
    !process.env.db_port ||
    !process.env.db_host
  ) {
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
