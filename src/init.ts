import Discord from 'discord.js';
import { del } from './commands/delete.js';
import { help } from './commands/help.js';
import { Command } from './types/Command.js';
import { Config } from './types/Config.js';

export const loadConfig = (): Config | null => {
  if (process.env.prefix && process.env.token) {
    return {
      prefix: process.env.prefix,
      token: process.env.token,
    };
  }

  return null;
};

export const getCommdansCollection = (): Discord.Collection<
  string,
  Command
> => {
  const collection = new Discord.Collection<string, Command>();

  collection.set(help.name, help);
  collection.set(del.name, del);

  return collection;
};
