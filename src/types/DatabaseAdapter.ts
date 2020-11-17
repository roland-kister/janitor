/*
DB structure:
drop table if exists prefixes;
create table prefixes (
  guild_id char(19) not null primary key,
  prefix char(64) not null
);

drop table if exists default_delete;
create table default_delete (
  channel_id char(19) not null primary key,
  command char(256) not null
);

drop table if exists watch_delete;
create table watch_delete (
  channel_id char(19) not null primary key,
  command char(256) not null
);
*/

export interface DatabaseAdapter {
  setPrefixForGuild(guildId: string, prefix: string): Promise<void>;
  getPrefixForGuild(guildId: string): Promise<string | undefined>;
  setDefaultDeleteForChannel(
    channelId: string,
    defaultDelete: string,
  ): Promise<void>;
  getDefaultDeleteForChannel(channelId: string): Promise<string | undefined>;
  unsetDefaultDeleteForChannel(channelId: string): Promise<void>;
  setWatchDeleteForChannel(
    channelId: string,
    watchDelete: string,
  ): Promise<void>;
  getWatchDeleteForChannel(channelId: string): Promise<string | undefined>;
  unsetWatchDeleteForChannel(channelId: string): Promise<void>;
}
