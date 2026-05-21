"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SiteShell } from "@/components/site-shell";
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
      <section className="section">
        <div className="container auth-card card">
          <h1>Verify email</h1>
          <form
            className="stack"
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
            <label>
              Email
              <input {...requestForm.register("email")} placeholder="you@company.com" />
            </label>
            <button className="secondary-button" type="submit" disabled={requestMutation.isPending}>
              {requestMutation.isPending ? "Sending..." : "Send verification code"}
            </button>
          </form>
          <form
            className="stack"
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
            <label>
              Verification code
              <input {...verifyForm.register("otp")} placeholder="123456" />
            </label>
            {devOtp ? <p className="helper-text">Local test code: {devOtp}</p> : null}
            {requestMutation.error ? <p className="field-error">{requestMutation.error.message}</p> : null}
            {verifyMutation.error ? <p className="field-error">{verifyMutation.error.message}</p> : null}
            {formError ? <p className="field-error">{formError}</p> : null}
            {verifyMutation.isSuccess ? (
              <p className="success-text">
                Email verified. <Link href="/login">Continue to login</Link>
              </p>
            ) : null}
            <button className="primary-button" type="submit" disabled={verifyMutation.isPending || verifyMutation.isSuccess}>
              {verifyMutation.isPending ? "Verifying..." : "Verify email"}
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
