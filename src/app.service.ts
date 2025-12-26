import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async getHello(): Promise<string> {
    try {
      await this.redis.set('healthcheck', 'OK', 'EX', 10);
      const value = await this.redis.get('healthcheck');

      if (value !== 'OK') {
        return 'Redis is reachable but not behaving as expected';
      }

      return 'Redis is running perfectly';
    } catch (error) {
      return 'Redis is NOT reachable';
    }
  }
}
