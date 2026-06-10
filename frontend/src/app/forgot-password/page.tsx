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

const schema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const form = useForm<FormValues>({ defaultValues: { email: "" } });
  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data, values) => {
      if (data.devResetToken) {
        setDevResetUrl(`/reset-password?email=${encodeURIComponent(values.email)}&token=${data.devResetToken}`);
      }
    },
  });

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
                  <h1 className="auth-title">Reset password</h1>
                  <p className="auth-desc">
                    Enter your account email and we&apos;ll send a secure reset link when email delivery is configured.
                  </p>
                </div>
                <form
                  className="auth-body"
                  onSubmit={form.handleSubmit((values) => {
                    const result = schema.safeParse(values);
                    if (!result.success) {
                      setFormError(result.error.issues[0]?.message ?? "Please enter a valid email.");
                      return;
                    }
                    setFormError(null);
                    setDevResetUrl(null);
                    mutation.mutate(values);
                  })}
                >
                  <label className="auth-field">
                    <span className="auth-label">Email</span>
                    <input
                      {...form.register("email")}
                      type="email"
                      placeholder="you@company.com"
                      className="auth-field-input"
                    />
                  </label>
                  {mutation.error ? <p className="auth-err">{mutation.error.message}</p> : null}
                  {formError ? <p className="auth-err">{formError}</p> : null}
                  {mutation.isSuccess ? (
                    <p className="success-text">If the account exists, a reset link has been prepared.</p>
                  ) : null}
                  {devResetUrl ? (
                    <p className="helper-text">
                      Local test link: <Link href={devResetUrl}>continue reset</Link>
                    </p>
                  ) : null}
                  <button className="auth-btn" type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Preparing..." : "Send reset link"}
                  </button>
                </form>
                <div className="auth-foot">
                  <span>Remembered it?</span>
                  <span className="auth-dot">·</span>
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
