"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    <SkeletonReveal
      skeleton={<AuthCardSkeleton />}
      delay={100}
    >
      <FadeIn>
        <div className="container auth-card card">
          <h1>Set new password</h1>
          <form
            className="stack"
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
            <label>
              Email
              <input {...form.register("email")} placeholder="you@company.com" />
            </label>
            <label>
              Reset token
              <input {...form.register("token")} placeholder="Secure token from email" />
            </label>
            <label>
              New password
              <input {...form.register("password")} type="password" placeholder="At least 8 characters" />
            </label>
            {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
            {formError ? <p className="field-error">{formError}</p> : null}
            {mutation.isSuccess ? (
              <p className="success-text">
                Password updated. <Link href="/login">Login now</Link>
              </p>
            ) : null}
            <button className="primary-button" type="submit" disabled={mutation.isPending || mutation.isSuccess}>
              {mutation.isPending ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </FadeIn>
    </SkeletonReveal>
  );
}

export default function ResetPasswordPage() {
  return (
    <SiteShell>
      <section className="section">
        <Suspense fallback={<div className="container auth-card card"><AuthCardSkeleton /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </SiteShell>
  );
}
