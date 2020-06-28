import Discord from 'discord.js';
import { CommandType, LogicalOperatorType, TokenType } from './DelTokenType';

export interface Token {
  type: TokenType;
  args: CommandTokenArgs | LogicOperatorTokenArgs;
  execute(message: Discord.Message): boolean;
}

export type CommandTokenArgs = string | RegExp;

export interface CommandToken extends Token {
  type: CommandType;
  args: CommandTokenArgs;
}

export type LogicOperatorTokenArgs = [CommandToken, Token];

export interface LogicOperatorToken extends Token {
  type: LogicalOperatorType;
  args: [CommandToken, Token];
}
