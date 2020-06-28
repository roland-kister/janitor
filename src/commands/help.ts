import Discord from 'discord.js';
import { getCommdansCollection } from '../init.js';
import { Command } from '../types/Command.js';

const execute = async (
  message: Discord.Message,
  args: string[],
): Promise<Discord.Message> => {
  if (args.length == 0) {
    const commands = getCommdansCollection();

    let helpMessage: string = '';

    commands.each((command) => {
      helpMessage = helpMessage.concat(
        '\n',
        command.name,
        ' - ',
        command.shortDescription,
      );
    });

    return message.channel.send(helpMessage);
  } else if (args.length == 1) {
    const commandName = args.shift() as string;

    const commands = getCommdansCollection();

    const command = commands.get(commandName);

    if (!command) {
      return message.channel.send('Príkaz nenájdený');
    }

    return message.channel.send(command.description);
  }

  return message.channel.send('Priveľa argumentov');
};

export const help: Command = {
  name: 'help',
  aliases: 'h',
  shortDescription: 'Vypíše všetky príkazy a ich použitie, napr. help del',
  description: `Syntax príkazu: help ([názov príkazu])
Ak nie je definovaný názov príkazu, vypíšu sa všetky príkazy a ich použitie
Ak je definovaný názov príkazu, vypíše sa jeho podrobné použitie`,
  execute,
};
