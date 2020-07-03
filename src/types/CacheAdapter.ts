export interface CacheAdapter {
  setPrefixForGuild(guildId: string, prefix: string | null): void;
  getPrefixForGuild(guildId: string): string | undefined;
  setDefaultDeleteForChannel(channelId: string, defaultDelete: string): void;
  getDefaultDeleteForChannel(channelId: string): string | undefined;
}
