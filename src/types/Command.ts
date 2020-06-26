import Discord from 'discord.js';

export type Command = {
  name: string;
  aliases?: string;
  description: string;
  execute(message: Discord.Message, args: string[]): Promise<Discord.Message>;
};
