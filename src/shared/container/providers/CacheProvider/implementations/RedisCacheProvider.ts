import Redis, { Redis as RedisType } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export default class CacheProvider implements ICacheProvider {
  private client: RedisType;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  public async recover(key: string): Promise<string | null> {
    const data = await this.client.get(key);

    return data;
  }

  public async invalidade(key: string): Promise<void> {
    console.log(key);
  }
}