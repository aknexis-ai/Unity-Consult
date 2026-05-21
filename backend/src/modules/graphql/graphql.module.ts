import { Module } from "@nestjs/common";

import { AnalyticsModule } from "../analytics/analytics.module";
import { InvoicesModule } from "../invoices/invoices.module";
import { LeadsModule } from "../leads/leads.module";
import { ProjectsModule } from "../projects/projects.module";
import { ServicesModule } from "../services/services.module";
import { GraphqlController } from "./graphql.controller";

@Module({
  imports: [AnalyticsModule, InvoicesModule, LeadsModule, ProjectsModule, ServicesModule],
  controllers: [GraphqlController],
})
export class GraphqlModule {}
