import type { StringValue } from "ms";
import { resolveAtlasUri } from "../common/utils/atlas-uri";

type EnvironmentShape = {
  NODE_ENV?: string;
  PORT?: string;
  APP_ORIGIN?: string;
  API_PREFIX?: string;
  MONGODB_URI?: string;
  REDIS_URL?: string;
  ENABLE_SWAGGER?: string;
  SWAGGER_PATH?: string;
  THROTTLE_TTL_MS?: string;
  THROTTLE_LIMIT?: string;
  JWT_ACCESS_SECRET?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_ACCESS_EXPIRES_IN?: string;
  JWT_REFRESH_EXPIRES_IN?: string;
  BCRYPT_SALT_ROUNDS?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_WHATSAPP_FROM?: string;
};

function requireValue(value: string | undefined, key: keyof EnvironmentShape): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }

  return value;
}

const env = process.env as EnvironmentShape;
const atlasUri = resolveAtlasUri(env.MONGODB_URI);

function hasPlaceholder(value: string) {
  return value.includes("<") || value.includes(">") || value.includes("...");
}

function readPositiveNumber(value: string | undefined, fallback: number, key: string) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive number.`);
  }

  return parsed;
}

export const appConfig = {
  nodeEnv: env.NODE_ENV ?? "development",
  isProduction: (env.NODE_ENV ?? "development") === "production",
  port: Number(env.PORT ?? 4000),
  appOrigin: env.APP_ORIGIN ?? "http://localhost:3000",
  apiPrefix: env.API_PREFIX ?? "api/v1",
  mongodbUri: atlasUri.uri,
  redisUrl: env.REDIS_URL ?? "",
  enableSwagger: env.ENABLE_SWAGGER === "true",
  swaggerPath: env.SWAGGER_PATH ?? "api/v1/docs",
  throttleTtlMs: readPositiveNumber(env.THROTTLE_TTL_MS, 60_000, "THROTTLE_TTL_MS"),
  throttleLimit: readPositiveNumber(env.THROTTLE_LIMIT, 120, "THROTTLE_LIMIT"),
  jwtAccessSecret: env.JWT_ACCESS_SECRET ?? "replace_with_a_strong_access_secret",
  jwtRefreshSecret: env.JWT_REFRESH_SECRET ?? "replace_with_a_strong_refresh_secret",
  jwtAccessExpiresIn: (env.JWT_ACCESS_EXPIRES_IN ?? "15m") as StringValue,
  jwtRefreshExpiresIn: (env.JWT_REFRESH_EXPIRES_IN ?? "7d") as StringValue,
  bcryptSaltRounds: Number(env.BCRYPT_SALT_ROUNDS ?? 12),
  razorpayKeyId: env.RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: env.RAZORPAY_KEY_SECRET ?? "",
  razorpayWebhookSecret: env.RAZORPAY_WEBHOOK_SECRET ?? "",
  resendApiKey: env.RESEND_API_KEY ?? "",
  twilioAccountSid: env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: env.TWILIO_AUTH_TOKEN ?? "",
  twilioWhatsappFrom: env.TWILIO_WHATSAPP_FROM ?? "",
};

export function validateEnvironment(input: EnvironmentShape) {
  requireValue(input.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET");
  requireValue(input.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");
  const mongodbUri = requireValue(input.MONGODB_URI, "MONGODB_URI");

  if (hasPlaceholder(mongodbUri)) {
    throw new Error("MONGODB_URI still contains placeholder text. Use a real MongoDB Atlas URI.");
  }

  const isSrvAtlasUri = mongodbUri.startsWith("mongodb+srv://");
  const isStandardAtlasUri = mongodbUri.startsWith("mongodb://") && mongodbUri.includes("tls=true");

  if (!isSrvAtlasUri && !isStandardAtlasUri) {
    throw new Error("MONGODB_URI must be a MongoDB Atlas mongodb+srv:// URI or a standard mongodb:// Atlas URI with tls=true.");
  }

  const optionalProviderKeys: (keyof EnvironmentShape)[] = [
    "REDIS_URL",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
    "RESEND_API_KEY",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_WHATSAPP_FROM",
  ];

  for (const key of optionalProviderKeys) {
    const value = input[key];

    if (value && hasPlaceholder(value)) {
      throw new Error(`${String(key)} still contains placeholder text.`);
    }
  }

  readPositiveNumber(input.THROTTLE_TTL_MS, 60_000, "THROTTLE_TTL_MS");
  readPositiveNumber(input.THROTTLE_LIMIT, 120, "THROTTLE_LIMIT");

  return input;
}
