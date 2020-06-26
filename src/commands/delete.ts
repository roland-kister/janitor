import Discord from 'discord.js';
import { Command } from '../types/Command.js';

export enum DeleteType {
  BOT = 'bot',
  REGEX = 'regex',
  // CONTAINING = 'containing',
}

const execute = async (
  message: Discord.Message,
  args: string[],
): Promise<Discord.Message> => {
  switch (args[0]) {
    case DeleteType.BOT:
      const userIds = message.mentions.users
        .array()
        .filter((user) => user.bot)
        .map((user) => user.id);

      const count = await deleteMessages(
        message.channel as Discord.TextChannel,
        (message: Discord.Message) => userIds.includes(message.author.id),
      );

      return message.channel.send(`Vymazal som ${count} správ`);
    case DeleteType.REGEX:
      try {
        const regex = new RegExp(args[1]);

        const count = await deleteMessages(
          message.channel as Discord.TextChannel,
          (message: Discord.Message) => regex.test(message.content),
        );

        return message.channel.send(`Vymazal som ${count} správ`);
      } catch (e) {
        return message.channel.send('Neplatný regulárny výraz');
      }
    default:
      return message.channel.send(
        'Neplatné použitie príkazu. Povolené argumenty: $del bot @Bot1 @Bot2 ... alebo $del regex regularny_vyraz',
      );
    // case DeleteType.CONTAINING:
    //   console.log('c');
    //   break;
  }
};

const deleteMessages = async (
  channel: Discord.TextChannel,
  filterCallback: (message: Discord.Message) => boolean,
): Promise<number> => {
  const limitDate = Date.now() - 1000000000;

  let lastId: string | undefined = undefined;

  let count: number = 0;

  while (1) {
    const messages: Discord.Collection<
      Discord.Snowflake,
      Discord.Message
    > = await channel.messages.fetch({ limit: 100, before: lastId }, false);

    let messageIds: string[] = [];

    if (
      messages.size === 0 ||
      messages.some((message, key) => {
        if (message.createdTimestamp < limitDate) {
          return true;
        }

        if (filterCallback(message)) {
          messageIds.push(key);
        }

        return false;
      })
    ) {
      break;
    }

    count += messageIds.length;

    await channel.bulkDelete(messageIds);

    lastId = messages.last()?.id;
  }

  return count;
};

export const del: Command = {
  name: 'del',
  aliases: 'd',
  description: 'Deletes messages from a given user',
  execute,
};
