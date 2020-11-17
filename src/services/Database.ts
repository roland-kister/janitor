import pg from 'pg';
import { DatabaseAdapter } from '../types/DatabaseAdapter.js';

export class Database implements DatabaseAdapter {
  private static databaseAdapter: DatabaseAdapter | undefined = undefined;

  private pool: pg.Pool;

  public static getDatabaseAdapter(): DatabaseAdapter {
    if (this.databaseAdapter === undefined) {
      this.databaseAdapter = new Database();
    }

    return this.databaseAdapter;
  }

  private constructor() {
    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      // user: process.env.db_user,
      // password: process.env.db_password,
      // database: process.env.db_name,
      // host: process.env.db_host,
      // port: parseInt(process.env.db_port as string, 10),
    });
  }

  async setPrefixForGuild(guildId: string, prefix: string): Promise<void> {
    await this.pool.query('DELETE FROM prefixes WHERE guild_id = $1', [
      guildId,
    ]);

    await this.pool.query(
      'INSERT INTO prefixes (guild_id, prefix) VALUES($1, $2)',
      [guildId, prefix],
    );
  }

  async getPrefixForGuild(guildId: string): Promise<string | undefined> {
    const response = await this.pool.query(
      'SELECT prefix FROM prefixes WHERE guild_id = $1',
      [guildId],
    );

    if (!response.rows[0]) {
      return undefined;
    }

    return response.rows[0].prefix.trim();
  }

  async setDefaultDeleteForChannel(
    channelId: string,
    defaultDelete: string,
  ): Promise<void> {
    await this.pool.query('DELETE FROM default_delete WHERE channel_id = $1', [
      channelId,
    ]);

    await this.pool.query(
      'INSERT INTO default_delete (channel_id, command) VALUES($1, $2)',
      [channelId, defaultDelete],
    );
  }

  async getDefaultDeleteForChannel(
    channelId: string,
  ): Promise<string | undefined> {
    const response = await this.pool.query(
      'SELECT command FROM default_delete WHERE channel_id = $1',
      [channelId],
    );

    if (!response.rows[0]) {
      return undefined;
    }

    return response.rows[0].command.trim();
  }

  async unsetDefaultDeleteForChannel(channelId: string): Promise<void> {
    await this.pool.query('DELETE FROM default_delete WHERE channel_id = $1', [
      channelId,
    ]);
  }

  async setWatchDeleteForChannel(
    channelId: string,
    watchDelete: string,
  ): Promise<void> {
    await this.pool.query('DELETE FROM watch_delete WHERE channel_id = $1', [
      channelId,
    ]);

    await this.pool.query(
      'INSERT INTO watch_delete (channel_id, command) VALUES($1, $2)',
      [channelId, watchDelete],
    );
  }

  async getWatchDeleteForChannel(
    channelId: string,
  ): Promise<string | undefined> {
    const response = await this.pool.query(
      'SELECT command FROM watch_delete WHERE channel_id = $1',
      [channelId],
    );

    if (!response.rows[0]) {
      return undefined;
    }

    return response.rows[0].command.trim();
  }

  async unsetWatchDeleteForChannel(channelId: string): Promise<void> {
    await this.pool.query('DELETE FROM watch_delete WHERE channel_id = $1', [
      channelId,
    ]);
  }
}
