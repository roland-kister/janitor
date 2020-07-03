import { Message } from 'discord.js';
import { getCommdansCollection } from '../init.js';
import { Command } from '../types/Command.js';

const execute = async (message: Message, args: string[]): Promise<Message> => {
  if (args.length == 0) {
    const commands = getCommdansCollection();

    let helpMessage: string = '```js\n';

    commands.each((command) => {
      helpMessage = helpMessage.concat(
        "\n'",
        command.name,
        "' - ",
        command.shortDescription,
      );
    });

    helpMessage = helpMessage.concat('\n```');

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
  shortDescription: "pomoc ku konkrétnemu príkazu, napr. 'help del'",
  description: `\`\`\`js
Použitie príkazu: 'help [názov príkazu]'
Ak sa vynechá 'názov príkazu', vypíšu sa všetky príkazy
\`\`\``,
  execute,
};
