import { createHash, randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { appConfig } from "../../config/app.config";
import { NotificationsService } from "../notifications/notifications.service";
import { UserDocument, UserRole } from "../users/schemas/user.schema";
import { UsersService } from "../users/users.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RequestEmailOtpDto } from "./dto/request-email-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { JwtAccessPayload, JwtRefreshPayload } from "./interfaces/jwt-payload.interface";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async register(input: RegisterDto) {
    const existing = await this.usersService.findByEmail(input.email);

    if (existing) {
      throw new ConflictException("A user with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(input.password, appConfig.bcryptSaltRounds);
    const user = await this.usersService.create({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone ?? null,
      passwordHash,
      role: input.role ?? UserRole.Client,
    });

    const tokens = await this.issueTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return this.buildAuthResponse(user, tokens);
  }

  async login(input: LoginDto) {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const tokens = await this.issueTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    await this.usersService.updateLastLogin(user.id);

    return this.buildAuthResponse(user, tokens);
  }

  async refresh(userId: string, refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is required.");
    }

    const user = await this.usersService.findById(userId);

    if (!user?.hashedRefreshToken) {
      throw new UnauthorizedException("Refresh session is not active.");
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException("Refresh token is invalid.");
    }

    const tokens = await this.issueTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return this.buildAuthResponse(user, tokens);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);

    return { success: true };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException("User not found.");
    }

    return {
      user: this.usersService.serializeUser(user),
    };
  }

  async requestEmailOtp(input: RequestEmailOtpDto) {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      return { success: true };
    }

    if (user.emailVerified) {
      return { success: true, alreadyVerified: true };
    }

    const otp = this.generateOtp();
    await this.usersService.updateEmailVerificationOtp(user.id, this.hashSecret(otp), this.minutesFromNow(10));
    const delivery = await this.notificationsService.sendEmailIfConfigured({
      to: user.email,
      subject: "Verify your Unity Consult account",
      html: `<p>Your Unity Consult verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    });

    return this.withDevSecret({ success: true, delivery }, "devOtp", otp);
  }

  async verifyEmail(input: VerifyEmailDto) {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new BadRequestException("Verification code is invalid or expired.");
    }

    if (user.emailVerified) {
      return { success: true, alreadyVerified: true };
    }

    if (!this.isStoredSecretValid(user.emailVerificationOtpHash, user.emailVerificationOtpExpiresAt, input.otp)) {
      throw new BadRequestException("Verification code is invalid or expired.");
    }

    await this.usersService.markEmailVerified(user.id);
    return { success: true };
  }

  async forgotPassword(input: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      return { success: true };
    }

    const token = randomBytes(32).toString("hex");
    await this.usersService.updatePasswordResetToken(user.id, this.hashSecret(token), this.minutesFromNow(30));
    const resetUrl = `${appConfig.appOrigin}/reset-password?email=${encodeURIComponent(user.email)}&token=${token}`;
    const delivery = await this.notificationsService.sendEmailIfConfigured({
      to: user.email,
      subject: "Reset your Unity Consult password",
      html: `<p>Use this secure link to reset your Unity Consult password:</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 30 minutes.</p>`,
    });

    return this.withDevSecret({ success: true, delivery }, "devResetToken", token);
  }

  async resetPassword(input: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(input.email);

    if (!user || !this.isStoredSecretValid(user.passwordResetTokenHash, user.passwordResetTokenExpiresAt, input.token)) {
      throw new BadRequestException("Reset token is invalid or expired.");
    }

    await this.usersService.updatePasswordAndClearRecovery(user.id, input.password);
    return { success: true };
  }

  private async issueTokens(user: UserDocument): Promise<AuthTokens> {
    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshPayload: JwtRefreshPayload = {
      ...accessPayload,
      tokenVersion: "refresh",
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: appConfig.jwtAccessSecret,
        expiresIn: appConfig.jwtAccessExpiresIn,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: appConfig.jwtRefreshSecret,
        expiresIn: appConfig.jwtRefreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, appConfig.bcryptSaltRounds);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }

  private buildAuthResponse(user: UserDocument, tokens: AuthTokens) {
    return {
      user: this.usersService.serializeUser(user),
      tokens,
    };
  }

  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private hashSecret(secret: string) {
    return createHash("sha256").update(secret).digest("hex");
  }

  private minutesFromNow(minutes: number) {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private isStoredSecretValid(secretHash: string | null | undefined, expiresAt: Date | null | undefined, secret: string) {
    return Boolean(secretHash && expiresAt && expiresAt.getTime() > Date.now() && secretHash === this.hashSecret(secret));
  }

  private withDevSecret<T extends Record<string, unknown>, K extends string>(payload: T, key: K, value: string) {
    if (appConfig.nodeEnv === "production") {
      return payload;
    }

    return { ...payload, [key]: value };
  }
}
