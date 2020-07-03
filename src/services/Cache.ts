import { CacheAdapter } from '../types/CacheAdapter.js';

export class Cache implements CacheAdapter {
  private static cacheAdapter: CacheAdapter | undefined = undefined;

  private prefixesForGuild: {
    guildId: string;
    prefix: string;
  }[] = [];

  public static getDatabaseAdapter(): CacheAdapter {
    if (this.cacheAdapter === undefined) {
      this.cacheAdapter = new Cache();
    }

    return this.cacheAdapter;
  }

  setPrefixForGuild(guildId: string, prefix: string | null): void {
    throw new Error('Method not implemented.');
  }
  getPrefixForGuild(guildId: string): string | undefined {
    throw new Error('Method not implemented.');
  }
  setDefaultDeleteForChannel(channelId: string, defaultDelete: string): void {
    throw new Error('Method not implemented.');
  }
  getDefaultDeleteForChannel(channelId: string): string | undefined {
    throw new Error('Method not implemented.');
  }
}
