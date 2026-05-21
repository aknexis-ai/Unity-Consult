import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AuditLog, AuditLogDocument } from "./schemas/audit-log.schema";

export type AuditLogInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  actorId?: string | null;
  actorRole?: string | null;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>) {}

  record(input: AuditLogInput) {
    return this.auditLogModel.create({
      ...input,
      entityId: input.entityId ?? null,
      actorId: input.actorId ?? null,
      actorRole: input.actorRole ?? null,
      metadata: input.metadata ?? {},
    });
  }

  findAll(limit = 100) {
    return this.auditLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(Math.min(Math.max(limit, 1), 500))
      .exec();
  }
}
