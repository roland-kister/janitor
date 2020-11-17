import Discord from 'discord.js';
import { del } from './commands/delete.js';
import { help } from './commands/help.js';
import { prefix } from './commands/prefix.js';
import { register } from './commands/register.js';
import { thanos } from './commands/thanos.js';
import { watch } from './commands/watch.js';
import { unregister } from './commands/unregister.js';
import { unwatch } from './commands/unwatch.js';
import { Command } from './types/Command.js';

export const isValidConfig = (): boolean => {
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
  collection.set(prefix.name, prefix);
  collection.set(register.name, register);
  collection.set(watch.name, watch);
  collection.set(unwatch.name, unwatch);
  collection.set(unregister.name, unregister);
  // collection.set(thanos.name, thanos);
  // help.aliases.forEach((alias) => {
  //   collection.set(alias, help);
  // });

  // del.aliases.forEach((alias) => {
  //   collection.set(alias, del);
  // });

  // prefix.aliases.forEach((alias) => {
  //   collection.set(alias, prefix);
  // });

  return collection;
};
