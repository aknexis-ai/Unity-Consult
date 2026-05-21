import { UserRole } from "../../users/schemas/user.schema";

export interface JwtAccessPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface JwtRefreshPayload extends JwtAccessPayload {
  tokenVersion: "refresh";
}
