import "dotenv/config";
import "reflect-metadata";

import { ForbiddenException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { FastifyRequest } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";

import { AppModule } from "./app.module";
import { AUTH_COOKIE_KEYS } from "./modules/auth/constants/auth.constants";
import { appConfig } from "./config/app.config";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function extractHeader(request: FastifyRequest, key: string) {
  const header = request.headers[key];
  return Array.isArray(header) ? header[0] : header;
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const fastify = app.getHttpAdapter().getInstance();

  app.setGlobalPrefix(appConfig.apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.register(fastifyCookie);

  // Support all common dev server addresses (localhost/127.0.0.1 on ports 3000 and 3001)
  const allowedOrigins = new Set([
    appConfig.appOrigin,
    appConfig.appOrigin.replace("localhost", "127.0.0.1"),
    appConfig.appOrigin.replace(":3000", ":3001"),
    appConfig.appOrigin.replace("localhost", "127.0.0.1").replace(":3000", ":3001"),
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ]);

  await app.register(fastifyCors, {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`), false);
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-CSRF-Token"],
  });
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });
  fastify.addHook("preHandler", async (request) => {
    if (!unsafeMethods.has(request.method)) {
      return;
    }

    if (request.url.startsWith("/api/v1/auth/csrf")) {
      return;
    }

    if (request.url.startsWith("/api/v1/payments/webhook")) {
      return;
    }

    const csrfCookie = request.cookies?.[AUTH_COOKIE_KEYS.csrfToken];
    const csrfHeader = extractHeader(request, "x-csrf-token");

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      throw new ForbiddenException("CSRF token is missing or invalid.");
    }
  });

  if (appConfig.enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Unity Consult API")
      .setDescription("REST API for the Unity Consult platform")
      .setVersion("1.0.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(appConfig.swaggerPath, app, document);
  }

  await app.listen({
    port: appConfig.port,
    host: "0.0.0.0",
  });
}

void bootstrap();
