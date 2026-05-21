import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import request from "supertest";

import { HealthController } from "../src/modules/health/health.controller";
import { HealthService } from "../src/modules/health/health.service";

describe("HealthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            getApplicationHealth: jest.fn().mockResolvedValue({ status: "ok" }),
            getProviderHealth: jest.fn().mockResolvedValue({ redis: { configured: false } }),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await (app as NestFastifyApplication).getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/health (GET)", async () => {
    await request(app.getHttpServer()).get("/health").expect(200).expect({ status: "ok" });
  });
});
