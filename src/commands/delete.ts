import { Collection, Message, Snowflake, TextChannel } from 'discord.js';
import { Database } from '../services/Database.js';
import { Command } from '../types/Command.js';
import { CommandToken, Token } from '../types/DelToken.js';
import { TokenError } from '../types/DelTokenError.js';
import { CommandType, LogicalOperatorType } from '../types/DelTokenType.js';
import { convertStringToEnum } from '../util.js';

const execute = async (message: Message, args: string[]): Promise<Message> => {
  try {
    try {
      if (args.length == 0) {
        const defaultCommand = await Database.getDatabaseAdapter().getDefaultDeleteForChannel(
          message.channel.id,
        );

        if (defaultCommand) {
          args = defaultCommand.split(' ');
        }
      }
    } catch (e) {
      return message.channel.send(
        'Neznáma chyba, za ktorú môže môj programátor',
      );
    }

    const rootToken = parseToken(args);

    const count = await deleteMessages(
      message.channel as TextChannel,
      rootToken,
    );

    switch (count) {
      case 0:
        return message.channel.send(
          `Nenašiel som žiadnu správu, ktorá by vyhovovala filtru`,
        );
      case 1:
        return message.channel.send(`Vymazal som 1 správu`);
      case 2:
      case 3:
      case 4:
        return message.channel.send(`Vymazal som ${count} správy`);
      default:
        return message.channel.send(`Vymazal som ${count} správ`);
    }
  } catch (e) {
    return message.channel.send(e.message);
  }
};

const deleteMessages = async (channel: TextChannel, rootToken: Token) => {
  const limitDate = Date.now() - 1000000000;

  let count: number = 0;

  let lastId: string | undefined = undefined;

  while (1) {
    const messages: Collection<
      Snowflake,
      Message
    > = await channel.messages.fetch({ limit: 100, before: lastId }, false);

    let messageIds: string[] = [];

    if (
      messages.size === 0 ||
      messages.some((message, key) => {
        if (message.createdTimestamp < limitDate) {
          return true;
        }

        if (rootToken.execute(message)) {
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

export const parseToken = (args: string[]): Token => {
  const commandType = getCommandType(args.shift());

  const arg = getArg(args.shift(), commandType);

  const command: CommandToken = {
    type: commandType,
    args: arg,
    execute: getCommandExecute(commandType, arg),
  };

  if (args.length === 0) {
    return command;
  }

  const logicalOperatorType = getLogicalOperatorType(args.shift() as string);

  const logicalOperatorArgs: [CommandToken, Token] = [
    command,
    parseToken(args),
  ];

  return {
    type: logicalOperatorType,
    args: logicalOperatorArgs,
    execute: getLogicalOperatorExecute(
      logicalOperatorType,
      logicalOperatorArgs,
    ),
  };
};

const getCommandType = (command: string | undefined): CommandType => {
  if (!command) {
    throw new TokenError(
      'Očakáva sa typ odstránenia. Povolené typy: bot, starts, regex',
      10,
    );
  }

  const enumValue = convertStringToEnum(CommandType, command);

  if (enumValue) {
    return enumValue;
  }

  throw new TokenError(
    'Neznámy typ odstránenia. Povelené typy: bot, starts, regex',
    10,
  );
};

const getArg = (
  arg: string | undefined,
  commandType: CommandType,
): string | RegExp => {
  switch (commandType) {
    case CommandType.BOT:
      if (!arg) {
        throw new TokenError('Očakáva sa označenie bota, napr. @Bot1', 10);
      }

      const match = /^<@.(\d+)>$/.exec(arg);

      if (!match) {
        throw new TokenError(
          'Nesprávne označenie bota. Očakáva sa oznečenie, napr. @Bot1',
          10,
        );
      }

      return match[1];

    case CommandType.REGEX:
      if (!arg) {
        throw new TokenError('Očakáva sa regulárny výraz, napr. ^-\\w+', 10);
      }

      try {
        return new RegExp(arg);
      } catch (e) {
        throw new TokenError('Nesprávny regulárny výraz', 10);
      }

    case CommandType.STARTS:
      if (!arg) {
        throw new TokenError(
          'Očakáva sa slovo, ktoré keď sa vyskytne na začiatku správy, tak správa bude vymazaná',
          10,
        );
      }

      return arg;
  }
};

const getLogicalOperatorType = (arg: string): LogicalOperatorType => {
  const enumValue = convertStringToEnum(LogicalOperatorType, arg);

  if (enumValue) {
    return enumValue;
  }

  throw new TokenError('Očakáva sa logický operátor: and, or', 10);
};

const getCommandExecute = (
  type: CommandType,
  arg: string | RegExp,
): ((message: Message) => boolean) => {
  switch (type) {
    case CommandType.BOT:
      return (message: Message): boolean => message.author.id === arg;

    case CommandType.REGEX:
      return (message: Message): boolean =>
        (arg as RegExp).test(message.content);

    case CommandType.STARTS:
      return (message: Message): boolean =>
        message.content.startsWith(arg as string);
  }
};

// const getCommandlololol programatorisko viktor string
// if rolko == debil:
//     realita
// else rolko == mrtev

// isFinite ok pa pa pa

const getLogicalOperatorExecute = (
  type: LogicalOperatorType,
  args: [CommandToken, Token],
): ((message: Message) => boolean) => {
  switch (type) {
    case LogicalOperatorType.AND:
      return (message: Message): boolean =>
        args[0].execute(message) && args[1].execute(message);

    case LogicalOperatorType.OR:
      return (message: Message): boolean =>
        args[0].execute(message) || args[1].execute(message);
  }
};

export const del: Command = {
  name: 'del',
  aliases: ['d'],
  shortDescription: 'Vymaže správy podľa poskytnutých argumentov',
  description: `\`\`\`js
Vymazanie správy na základe podmienky
 Typy vymazania:
- 'bot' -> 'del bot @Bot1'
- 'starts' -> 'del starts -play' (všetky správy začínajúce daným textom)
- 'regex' -> 'del regex ^-\\w+'

Logické operátory:
 Použitie 'del bot @Bot1 or starts -play'
- 'and' -> výraz napravo A AJ naľavo musí byť pravdivý na vymazanie
- 'or' -> výraz napravo ALEBO naľavo musí byť pravdivý na vymazanie
\`\`\``,
  execute,
};
