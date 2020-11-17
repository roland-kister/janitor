import { Guild, Message, VoiceChannel } from 'discord.js';
import { Command } from '../types/Command.js';

const execute = async (message: Message, args: string[]): Promise<Message> => {
  const memberIds = randomShuffle(
    (message.guild as Guild).channels.cache.reduce<string[]>(
      (result, channel) => {
        if (channel instanceof VoiceChannel) {
          return [
            ...result,
            ...channel.members.array().map((member) => member.id),
          ];
        }

        return result;
      },
      [],
    ),
  );

  console.log(memberIds);

  return message.channel.send('Priveľa argumentov');
};

const randomShuffle = <T>(arr: T[]): T[] => {
  let m: number = arr.length;
  let i: number;
  let t: T;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
};

export const thanos: Command = {
  name: 'thanos',
  aliases: [],
  shortDescription: 'Thanos :-)',
  description: `\`\`\`js
Thanos :-)
\`\`\``,
  execute,
};
