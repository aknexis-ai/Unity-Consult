"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal, StaggerContainer, StaggerItem } from "@/components/motion-primitives";
import { AuthCardSkeleton } from "@/components/skeleton-system";
import { authApi } from "@/lib/api/resources";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const prefetchCsrf = async () => {
      try {
        await apiClient.get("/auth/csrf");
      } catch {
        // CSRF token will be fetched on demand by the Axios interceptor
      }
    };
    prefetchCsrf();
  }, []);

  const form = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession({ accessToken: data.tokens.accessToken, user: data.user });
      router.push(data.user.role === "client" ? "/portal" : "/admin");
    },
  });

  return (
    <SiteShell>
      <section className="section auth-section">
        <div className="auth-bg" />
        <div className="auth-blob auth-blob--1" />
        <div className="auth-blob auth-blob--2" />
        <SkeletonReveal
          skeleton={<AuthCardSkeleton />}
          delay={100}
        >
          <div className="auth-card-wrap">
            <FadeIn delay={0.1}>
              <div className="auth-card card">
                <div className="auth-head">
                  <div className="auth-icon">
                    <Sparkles size={22} />
                  </div>
                  <h1 className="auth-title">Welcome back</h1>
                  <p className="auth-desc">Sign in to pick up where you left off.</p>
                </div>
                <form
                  className="auth-body"
                  onSubmit={form.handleSubmit((values) => {
                    const result = schema.safeParse(values);
                    if (!result.success) {
                      setFormError(result.error.issues[0]?.message ?? "Please check your login details.");
                      return;
                    }
                    setFormError(null);
                    mutation.mutate(values);
                  })}
                >
                  <StaggerContainer staggerDelay={0.07}>
                    <StaggerItem>
                      <label className="auth-field">
                        <span className="auth-label">Email</span>
                        <input
                          {...form.register("email")}
                          type="email"
                          placeholder="you@company.com"
                          className="auth-field-input"
                        />
                      </label>
                    </StaggerItem>
                    <StaggerItem>
                      <label className="auth-field">
                        <span className="auth-label">Password</span>
                        <div className="auth-inner">
                          <input
                            {...form.register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="auth-field-input auth-field-input--pad"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="auth-eye"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </label>
                    </StaggerItem>
                    <StaggerItem>
                      {mutation.error && <p className="auth-err">{mutation.error.message}</p>}
                      {formError && <p className="auth-err">{formError}</p>}
                    </StaggerItem>
                    <StaggerItem>
                      <button className="auth-btn" type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? (
                          <span className="auth-btn-load">
                            <span>Signing in</span>
                            <span className="auth-dots" />
                          </span>
                        ) : (
                          <>
                            <LogIn size={17} />
                            Sign in
                          </>
                        )}
                      </button>
                    </StaggerItem>
                  </StaggerContainer>
                </form>
                <FadeIn delay={0.45}>
                  <div className="auth-foot">
                    <Link href="/register">Create an account</Link>
                    <span className="auth-dot">·</span>
                    <Link href="/forgot-password">Reset password</Link>
                  </div>
                </FadeIn>
              </div>
            </FadeIn>
          </div>
        </SkeletonReveal>
      </section>
    </SiteShell>
  );
}
