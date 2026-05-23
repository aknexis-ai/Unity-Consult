"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Sparkles, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal, StaggerContainer, StaggerItem } from "@/components/motion-primitives";
import { AuthCardSkeleton } from "@/components/skeleton-system";
import { authApi } from "@/lib/api/resources";
import { useAuthStore } from "@/lib/stores/auth-store";
import { apiClient } from "@/lib/api/client";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const { confirmPassword, ...rest } = values;
      return authApi.register({ ...rest, role: "client" });
    },
    onSuccess: (data) => {
      setSession({ accessToken: data.tokens.accessToken, user: data.user });
      router.push("/portal");
    },
  });

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await apiClient.get("/auth/csrf");
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, []);

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
                  <h1 className="auth-title">Get started</h1>
                  <p className="auth-desc">Create your account and access your client portal.</p>
                </div>
                <form
                  className="auth-body"
                  onSubmit={form.handleSubmit((values) => {
                    const result = schema.safeParse(values);
                    if (!result.success) {
                      setFormError(result.error.issues[0]?.message ?? "Please check your account details.");
                      return;
                    }
                    setFormError(null);
                    mutation.mutate(values);
                  })}
                >
                  <StaggerContainer staggerDelay={0.05}>
                    <StaggerItem>
                      <label className="auth-field">
                        <span className="auth-label">Name</span>
                        <input
                          {...form.register("name")}
                          placeholder="Your full name"
                          className="auth-field-input"
                        />
                      </label>
                    </StaggerItem>
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
                        <span className="auth-label">Phone</span>
                        <input
                          {...form.register("phone")}
                          placeholder="+91 98765 43210"
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
                            placeholder="At least 8 characters"
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
                      <label className="auth-field">
                        <span className="auth-label">Confirm Password</span>
                        <div className="auth-inner">
                          <input
                            {...form.register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            className="auth-field-input auth-field-input--pad"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="auth-eye"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                            <span>Creating account</span>
                            <span className="auth-dots" />
                          </span>
                        ) : (
                          <>
                            <UserPlus size={17} />
                            Create account
                          </>
                        )}
                      </button>
                    </StaggerItem>
                  </StaggerContainer>
                </form>
                <FadeIn delay={0.5}>
                  <div className="auth-foot">
                    <Link href="/login">Already have access? Sign in</Link>
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
