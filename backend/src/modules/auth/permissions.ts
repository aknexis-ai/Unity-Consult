import { UserRole } from "../users/schemas/user.schema";

export const permissionMatrix = {
  finance: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Staff, UserRole.Finance],
  hr: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Staff, UserRole.Hr],
  content: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Staff, UserRole.Content, UserRole.Seo],
  crm: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Staff, UserRole.CrmOps, UserRole.Operations],
  support: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Staff, UserRole.Support],
  clientWorkspace: [
    UserRole.SuperAdmin,
    UserRole.Admin,
    UserRole.Staff,
    UserRole.Finance,
    UserRole.Support,
    UserRole.Seo,
    UserRole.Design,
    UserRole.Content,
    UserRole.Hr,
    UserRole.Operations,
    UserRole.CrmOps,
    UserRole.Client,
  ],
} as const;
