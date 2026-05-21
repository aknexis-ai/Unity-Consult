import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";

import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { ContentModule } from "./modules/content/content.module";
import { DatabaseModule } from "./modules/database/database.module";
import { HealthModule } from "./modules/health/health.module";
import { GraphqlModule } from "./modules/graphql/graphql.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { RedisModule } from "./modules/redis/redis.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { ServicesModule } from "./modules/services/services.module";
import { TeamModule } from "./modules/team/team.module";
import { TicketsModule } from "./modules/tickets/tickets.module";
import { UsersModule } from "./modules/users/users.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { appConfig, validateEnvironment } from "./config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
      expandVariables: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: appConfig.throttleTtlMs,
        limit: appConfig.throttleLimit,
      },
    ]),
    MongooseModule.forRoot(appConfig.mongodbUri),
    DatabaseModule,
    HealthModule,
    GraphqlModule,
    RedisModule,
    RealtimeModule,
    AuditModule,
    UsersModule,
    AuthModule,
    BookingsModule,
    LeadsModule,
    OrdersModule,
    ProjectsModule,
    InvoicesModule,
    PaymentsModule,
    DocumentsModule,
    TicketsModule,
    MessagesModule,
    TeamModule,
    ContentModule,
    ServicesModule,
    SettingsModule,
    AnalyticsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
