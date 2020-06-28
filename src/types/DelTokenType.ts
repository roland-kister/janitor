export enum CommandType {
  BOT = 'bot',
  STARTS = 'starts',
  REGEX = 'regex',
}

export enum LogicalOperatorType {
  AND = 'and',
  OR = 'or',
}

export type TokenType = CommandType | LogicalOperatorType;
