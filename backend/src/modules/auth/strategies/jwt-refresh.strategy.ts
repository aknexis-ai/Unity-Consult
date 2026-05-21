import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { appConfig } from "../../../config/app.config";
import { AUTH_COOKIE_KEYS } from "../constants/auth.constants";
import { JwtRefreshPayload } from "../interfaces/jwt-payload.interface";

function extractRefreshToken(request: Request) {
  return (request.cookies?.[AUTH_COOKIE_KEYS.refreshToken] as string | undefined) ?? null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtRefreshPayload) {
    const refreshToken = extractRefreshToken(request) ?? request.headers.authorization?.replace("Bearer ", "");

    return {
      ...payload,
      refreshToken,
    };
  }
}
