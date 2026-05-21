import { Injectable, OnModuleDestroy, ServiceUnavailableException } from "@nestjs/common";
import Redis from "ioredis";

import { appConfig } from "../../config/app.config";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client = appConfig.redisUrl ? new Redis(appConfig.redisUrl, { lazyConnect: true }) : null;

  async getClient() {
    if (!this.client) {
      throw new ServiceUnavailableException("REDIS_URL is missing. Add it to backend/.env for Redis-backed features.");
    }

    if (this.client.status === "wait") {
      await this.client.connect();
    }

    return this.client;
  }

  async setJson(key: string, value: unknown, ttlSeconds: number) {
    const client = await this.getClient();
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async getJson<T>(key: string) {
    const client = await this.getClient();
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async onModuleDestroy() {
    this.client?.disconnect();
  }
}
