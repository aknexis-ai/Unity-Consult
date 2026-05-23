import { Body, Controller, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AnalyticsService } from "../analytics/analytics.service";
import { InvoicesService } from "../invoices/invoices.service";
import { LeadsService } from "../leads/leads.service";
import { ProjectsService } from "../projects/projects.service";
import { ServicesService } from "../services/services.service";
import { UserRole } from "../users/schemas/user.schema";

type GraphqlRequest = {
  query?: string;
};

@Controller("graphql")
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.Staff, UserRole.Finance, UserRole.CrmOps, UserRole.Operations, UserRole.Content, UserRole.Seo)
export class GraphqlController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly invoicesService: InvoicesService,
    private readonly leadsService: LeadsService,
    private readonly projectsService: ProjectsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Post()
  async execute(@Body() body: GraphqlRequest) {
    const query = body.query?.toLowerCase() ?? "";
    const data: Record<string, unknown> = {};

    if (query.includes("adminmetrics")) data.adminMetrics = await this.analyticsService.getAdminMetrics();
    if (query.includes("portalmetrics")) data.portalMetrics = await this.analyticsService.getPortalMetrics();
    if (query.includes("services")) data.services = await this.servicesService.findAll();
    if (query.includes("leads")) data.leads = await this.leadsService.findAll();
    if (query.includes("projects")) data.projects = await this.projectsService.findAll();
    if (query.includes("invoices")) data.invoices = await this.invoicesService.findAll();

    return {
      data,
      extensions: {
        note: "Lightweight GraphQL-compatible endpoint for PRD query aggregation. REST remains the primary API.",
      },
    };
  }
}
