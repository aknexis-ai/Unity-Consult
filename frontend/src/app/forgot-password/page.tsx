"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
      <section className="section">
        <SkeletonReveal
          skeleton={<AuthCardSkeleton />}
          delay={100}
        >
          <FadeIn>
            <div className="container auth-card card">
            <h1>Reset password</h1>
            <p>Enter your account email and we will send a secure reset link when email delivery is configured.</p>
            <form
              className="stack"
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
              <label>
                Email
                <input {...form.register("email")} placeholder="you@company.com" />
              </label>
              {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
              {formError ? <p className="field-error">{formError}</p> : null}
              {mutation.isSuccess ? <p className="success-text">If the account exists, a reset link has been prepared.</p> : null}
              {devResetUrl ? (
                <p className="helper-text">
                  Local test link: <Link href={devResetUrl}>continue reset</Link>
                </p>
              ) : null}
              <button className="primary-button" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Preparing..." : "Send reset link"}
              </button>
            </form>
            <p>
              Remembered it? <Link href="/login">Back to login</Link>
            </p>
          </div>
        </FadeIn>
        </SkeletonReveal>
      </section>
    </SiteShell>
  );
}
