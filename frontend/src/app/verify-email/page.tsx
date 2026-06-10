"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles } from "lucide-react";

import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { AuthCardSkeleton } from "@/components/skeleton-system";
import { authApi } from "@/lib/api/resources";

const requestSchema = z.object({
  email: z.string().email(),
});

const verifySchema = requestSchema.extend({
  otp: z.string().regex(/^\d{6}$/),
});

type RequestValues = z.infer<typeof requestSchema>;
type VerifyValues = z.infer<typeof verifySchema>;

export default function VerifyEmailPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const requestForm = useForm<RequestValues>({ defaultValues: { email: "" } });
  const verifyForm = useForm<VerifyValues>({ defaultValues: { email: "", otp: "" } });
  const requestMutation = useMutation({
    mutationFn: authApi.requestEmailOtp,
    onSuccess: (data, values) => {
      verifyForm.setValue("email", values.email);
      setDevOtp(data.devOtp ?? null);
    },
  });
  const verifyMutation = useMutation({ mutationFn: authApi.verifyEmail });

  return (
    <SiteShell>
      <section className="section auth-section">
        <div className="auth-bg" />
        <div className="auth-blob auth-blob--1" />
        <div className="auth-blob auth-blob--2" />
        <SkeletonReveal skeleton={<AuthCardSkeleton />} delay={100}>
          <div className="auth-card-wrap">
            <FadeIn delay={0.1}>
              <div className="auth-card card">
                <div className="auth-head">
                  <div className="auth-icon">
                    <Sparkles size={22} />
                  </div>
                  <h1 className="auth-title">Verify email</h1>
                  <p className="auth-desc">Request a verification code, then enter the 6-digit code to confirm your email.</p>
                </div>
                <form
                  className="auth-body"
                  onSubmit={requestForm.handleSubmit((values) => {
                    const result = requestSchema.safeParse(values);
                    if (!result.success) {
                      setFormError(result.error.issues[0]?.message ?? "Please enter a valid email.");
                      return;
                    }
                    setFormError(null);
                    requestMutation.mutate(values);
                  })}
                >
                  <label className="auth-field">
                    <span className="auth-label">Email</span>
                    <input
                      {...requestForm.register("email")}
                      type="email"
                      placeholder="you@company.com"
                      className="auth-field-input"
                    />
                  </label>
                  <button className="auth-btn auth-btn--ghost" type="submit" disabled={requestMutation.isPending}>
                    {requestMutation.isPending ? "Sending..." : "Send verification code"}
                  </button>
                </form>
                <form
                  className="auth-body"
                  onSubmit={verifyForm.handleSubmit((values) => {
                    const result = verifySchema.safeParse(values);
                    if (!result.success) {
                      setFormError(result.error.issues[0]?.message ?? "Please enter the 6-digit code.");
                      return;
                    }
                    setFormError(null);
                    verifyMutation.mutate(values);
                  })}
                >
                  <label className="auth-field">
                    <span className="auth-label">Verification code</span>
                    <input
                      {...verifyForm.register("otp")}
                      inputMode="numeric"
                      placeholder="123456"
                      className="auth-field-input"
                    />
                  </label>
                  {devOtp ? <p className="helper-text">Local test code: {devOtp}</p> : null}
                  {requestMutation.error ? <p className="auth-err">{requestMutation.error.message}</p> : null}
                  {verifyMutation.error ? <p className="auth-err">{verifyMutation.error.message}</p> : null}
                  {formError ? <p className="auth-err">{formError}</p> : null}
                  {verifyMutation.isSuccess ? (
                    <p className="success-text">
                      Email verified. <Link href="/login">Continue to login</Link>
                    </p>
                  ) : null}
                  <button className="auth-btn" type="submit" disabled={verifyMutation.isPending || verifyMutation.isSuccess}>
                    {verifyMutation.isPending ? "Verifying..." : "Verify email"}
                  </button>
                </form>
                <div className="auth-foot">
                  <Link href="/login">Back to login</Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </SkeletonReveal>
      </section>
    </SiteShell>
  );
}
