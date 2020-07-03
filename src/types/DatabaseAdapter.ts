/*
DB structure:
CREATE TABLE prefixes (
  guild_id CHAR(19) NOT NULL,
  prefix CHAR(64) NOT NULL
);

CREATE TABLE default_delete (
  channel_id CHAR(19) NOT NULL,
  command CHAR(256) NOT NULL
);

CREATE INDEX prefix_guild_id_idx ON prefixes (guild_id);
CREATE INDEX default_delete_channel_id_idx ON default_delete (channel_id);
*/

export interface DatabaseAdapter {
  setPrefixForGuild(guildId: string, prefix: string): Promise<void>;
  getPrefixForGuild(guildId: string): Promise<string | undefined>;
  setDefaultDeleteForChannel(
    channelId: string,
    defaultDelete: string,
  ): Promise<void>;
  getDefaultDeleteForChannel(channelId: string): Promise<string | undefined>;
}
