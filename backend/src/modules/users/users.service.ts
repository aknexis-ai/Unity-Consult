import bcrypt from "bcrypt";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { appConfig } from "../../config/app.config";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  create(input: Partial<User>) {
    return this.userModel.create(input);
  }

  async createFromAdmin(input: CreateUserDto) {
    const existing = await this.findByEmail(input.email);

    if (existing) {
      throw new ConflictException("A user with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(input.password, appConfig.bcryptSaltRounds);
    const user = await this.userModel.create({
      ...input,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
    });

    return this.serializeUser(user);
  }

  async findAll() {
    const users = await this.userModel.find().sort({ createdAt: -1 }).exec();
    return users.map((user) => this.serializeUser(user));
  }

  async findPublicById(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return this.serializeUser(user);
  }

  async update(userId: string, input: UpdateUserDto, allowAdminFields: boolean) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (input.email && input.email.toLowerCase() !== user.email) {
      const existing = await this.findByEmail(input.email);

      if (existing && existing.id !== userId) {
        throw new ConflictException("A user with this email already exists.");
      }

      user.email = input.email.toLowerCase();
    }

    if (typeof input.name === "string") user.name = input.name;
    if ("phone" in input) user.phone = input.phone ?? null;
    if ("company" in input) user.company = input.company ?? null;
    if ("title" in input) user.title = input.title ?? null;
    if ("avatarUrl" in input) user.avatarUrl = input.avatarUrl ?? null;

    if (allowAdminFields) {
      if (input.role) user.role = input.role;
      if (typeof input.isActive === "boolean") user.isActive = input.isActive;
    }

    if (input.password) {
      user.passwordHash = await bcrypt.hash(input.password, appConfig.bcryptSaltRounds);
    }

    await user.save();

    return this.serializeUser(user);
  }

  updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    return this.userModel
      .findByIdAndUpdate(userId, { hashedRefreshToken }, { returnDocument: "after" })
      .exec();
  }

  updateEmailVerificationOtp(userId: string, otpHash: string, expiresAt: Date) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          emailVerificationOtpHash: otpHash,
          emailVerificationOtpExpiresAt: expiresAt,
        },
        { returnDocument: "after" },
      )
      .exec();
  }

  markEmailVerified(userId: string) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          emailVerified: true,
          emailVerificationOtpHash: null,
          emailVerificationOtpExpiresAt: null,
        },
        { returnDocument: "after" },
      )
      .exec();
  }

  updatePasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          passwordResetTokenHash: tokenHash,
          passwordResetTokenExpiresAt: expiresAt,
        },
        { returnDocument: "after" },
      )
      .exec();
  }

  async updatePasswordAndClearRecovery(userId: string, password: string) {
    const passwordHash = await bcrypt.hash(password, appConfig.bcryptSaltRounds);

    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          passwordHash,
          hashedRefreshToken: null,
          passwordResetTokenHash: null,
          passwordResetTokenExpiresAt: null,
        },
        { returnDocument: "after" },
      )
      .exec();
  }

  updateLastLogin(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { lastLoginAt: new Date() }, { returnDocument: "after" }).exec();
  }

  async updatePermissions(userId: string, permissions: string[]) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { permissions },
      { returnDocument: "after" },
    ).exec();

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return this.serializeUser(user);
  }

  serializeUser(user: UserDocument) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      company: user.company ?? null,
      title: user.title ?? null,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role,
      permissions: user.permissions ?? [],
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
