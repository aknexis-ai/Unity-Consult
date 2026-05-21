import { randomBytes } from "crypto";
import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from "@nestjs/common";
import { FastifyReply } from "fastify";

import { appConfig } from "../../config/app.config";
import { CurrentUser } from "./decorators/current-user.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { RegisterDto } from "./dto/register.dto";
import { RequestEmailOtpDto } from "./dto/request-email-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { forgotPasswordSchema, loginSchema, registerSchema, requestEmailOtpSchema, resetPasswordSchema, verifyEmailSchema } from "./dto/auth.zod";
import { JwtAccessGuard } from "./guards/jwt-access.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { AuthService } from "./auth.service";
import { AUTH_COOKIE_KEYS } from "./constants/auth.constants";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("csrf")
  getCsrfToken(@Res({ passthrough: true }) response: FastifyReply) {
    const token = randomBytes(32).toString("hex");

    response.setCookie(AUTH_COOKIE_KEYS.csrfToken, token, {
      httpOnly: false,
      secure: appConfig.appOrigin.startsWith("https://"),
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return { csrfToken: token };
  }

  @Post("register")
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const result = await this.authService.register(body);
    this.setRefreshCookie(response, result.tokens.refreshToken);

    return result;
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body(new ZodValidationPipe(loginSchema)) body: LoginDto, @Res({ passthrough: true }) response: FastifyReply) {
    const result = await this.authService.login(body);
    this.setRefreshCookie(response, result.tokens.refreshToken);

    return result;
  }

  @Post("refresh")
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  async refresh(
    @CurrentUser("sub") userId: string,
    @CurrentUser("refreshToken") strategyRefreshToken: string | undefined,
    @Body() body: RefreshDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const refreshToken = strategyRefreshToken ?? body.refreshToken;
    const result = await this.authService.refresh(userId, refreshToken);
    this.setRefreshCookie(response, result.tokens.refreshToken);

    return result;
  }

  @Post("request-email-otp")
  @HttpCode(200)
  requestEmailOtp(@Body(new ZodValidationPipe(requestEmailOtpSchema)) body: RequestEmailOtpDto) {
    return this.authService.requestEmailOtp(body);
  }

  @Post("verify-email")
  @HttpCode(200)
  verifyEmail(@Body(new ZodValidationPipe(verifyEmailSchema)) body: VerifyEmailDto) {
    return this.authService.verifyEmail(body);
  }

  @Post("forgot-password")
  @HttpCode(200)
  forgotPassword(@Body(new ZodValidationPipe(forgotPasswordSchema)) body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post("reset-password")
  @HttpCode(200)
  resetPassword(@Body(new ZodValidationPipe(resetPasswordSchema)) body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @Post("logout")
  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  async logout(@CurrentUser("sub") userId: string, @Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie(AUTH_COOKIE_KEYS.refreshToken, { path: "/" });
    return this.authService.logout(userId);
  }

  @Get("me")
  @UseGuards(JwtAccessGuard)
  me(@CurrentUser("sub") userId: string) {
    return this.authService.me(userId);
  }

  private setRefreshCookie(response: FastifyReply, refreshToken: string) {
    response.setCookie(AUTH_COOKIE_KEYS.refreshToken, refreshToken, {
      httpOnly: true,
      secure: appConfig.appOrigin.startsWith("https://"),
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }
}
