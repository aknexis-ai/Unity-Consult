import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(8),
  // role is restricted from public registration — admins set roles via the admin panel
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const requestEmailOtpSchema = z.object({
  email: z.string().email(),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(16),
  password: z.string().min(8),
});
