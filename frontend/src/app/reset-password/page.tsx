"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles } from "lucide-react";

import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { AuthCardSkeleton } from "@/components/skeleton-system";
import { authApi } from "@/lib/api/resources";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(16),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const params = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    defaultValues: {
      email: params.get("email") ?? "",
      token: params.get("token") ?? "",
      password: "",
    },
  });
  const mutation = useMutation({ mutationFn: authApi.resetPassword });

  return (
    <SkeletonReveal skeleton={<AuthCardSkeleton />} delay={100}>
      <div className="auth-card-wrap">
        <FadeIn delay={0.1}>
          <div className="auth-card card">
            <div className="auth-head">
              <div className="auth-icon">
                <Sparkles size={22} />
              </div>
              <h1 className="auth-title">Set new password</h1>
              <p className="auth-desc">Enter the secure token from your email and choose a new password.</p>
            </div>
            <form
              className="auth-body"
              onSubmit={form.handleSubmit((values) => {
                const result = schema.safeParse(values);
                if (!result.success) {
                  setFormError(result.error.issues[0]?.message ?? "Please check the reset details.");
                  return;
                }
                setFormError(null);
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
              <label className="auth-field">
                <span className="auth-label">Reset token</span>
                <input
                  {...form.register("token")}
                  placeholder="Secure token from email"
                  className="auth-field-input"
                />
              </label>
              <label className="auth-field">
                <span className="auth-label">New password</span>
                <input
                  {...form.register("password")}
                  type="password"
                  placeholder="At least 8 characters"
                  className="auth-field-input"
                />
              </label>
              {mutation.error ? <p className="auth-err">{mutation.error.message}</p> : null}
              {formError ? <p className="auth-err">{formError}</p> : null}
              {mutation.isSuccess ? (
                <p className="success-text">
                  Password updated. <Link href="/login">Login now</Link>
                </p>
              ) : null}
              <button className="auth-btn" type="submit" disabled={mutation.isPending || mutation.isSuccess}>
                {mutation.isPending ? "Updating..." : "Update password"}
              </button>
            </form>
            <div className="auth-foot">
              <Link href="/login">Back to login</Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </SkeletonReveal>
  );
}

export default function ResetPasswordPage() {
  return (
    <SiteShell>
      <section className="section auth-section">
        <div className="auth-bg" />
        <div className="auth-blob auth-blob--1" />
        <div className="auth-blob auth-blob--2" />
        <Suspense
          fallback={
            <div className="auth-card-wrap">
              <div className="auth-card card">
                <AuthCardSkeleton />
              </div>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </section>
    </SiteShell>
  );
}
