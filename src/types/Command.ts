import { Message } from 'discord.js';

export type Command = {
  name: string;
  aliases: string[];
  shortDescription: string;
  description: string;
  execute(message: Message, args: string[]): Promise<Message>;
};
