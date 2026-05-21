import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import type { Connection } from "mongoose";

import { appConfig } from "../../config/app.config";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly redisService: RedisService,
  ) {}

  async getApplicationHealth() {
    const mongoState = this.connection.readyState;

    return {
      status: mongoState === 1 ? "ok" : "degraded",
      service: "unity-consult-api",
      timestamp: new Date().toISOString(),
      apiPrefix: appConfig.apiPrefix,
      database: {
        state: mongoState,
      },
    };
  }

  async getProviderHealth() {
    const redisStatus = await this.getRedisStatus();

    return {
      mongodbAtlas: {
        configured: Boolean(appConfig.mongodbUri),
        connected: this.connection.readyState === 1,
        requiredKey: "MONGODB_URI",
      },
      redis: redisStatus,
      razorpay: {
        configured: Boolean(
          appConfig.razorpayKeyId && appConfig.razorpayKeySecret && appConfig.razorpayWebhookSecret,
        ),
        mode: appConfig.razorpayKeyId.startsWith("rzp_test_") ? "sandbox" : "live",
        requiredKeys: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"],
      },
      resend: {
        configured: Boolean(appConfig.resendApiKey),
        requiredKey: "RESEND_API_KEY",
      },
      twilioWhatsapp: {
        configured: Boolean(appConfig.twilioAccountSid && appConfig.twilioAuthToken && appConfig.twilioWhatsappFrom),
        requiredKeys: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_WHATSAPP_FROM"],
      },
    };
  }

  private async getRedisStatus() {
    if (!appConfig.redisUrl) {
      return {
        configured: false,
        connected: false,
        requiredKey: "REDIS_URL",
      };
    }

    try {
      const client = await this.redisService.getClient();
      await client.ping();

      return {
        configured: true,
        connected: true,
        requiredKey: "REDIS_URL",
      };
    } catch {
      return {
        configured: true,
        connected: false,
        requiredKey: "REDIS_URL",
      };
    }
  }
}
