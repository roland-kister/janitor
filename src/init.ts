import Discord from 'discord.js';
import fs from 'fs';
import yaml from 'js-yaml';
import { del } from './commands/delete.js';
import { help } from './commands/help.js';
import { Command } from './types/Command.js';
import { Config } from './types/Config.js';

export const loadConfig = (configFilePath: string): Config | null => {
  try {
    const configFile = fs.readFileSync(configFilePath, { encoding: 'utf-8' });

    return yaml.safeLoad(configFile);
  } catch (e) {
    return null;
  }
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
