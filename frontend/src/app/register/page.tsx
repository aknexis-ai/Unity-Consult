"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SiteShell } from "@/components/site-shell";
import { authApi } from "@/lib/api/resources";
import { useAuthStore } from "@/lib/stores/auth-store";
import { apiClient } from "@/lib/api/client";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });
  
  const mutation = useMutation({
    mutationFn: (values: FormValues) => authApi.register({ ...values, role: "client" }),
    onSuccess: (data) => {
      setSession({ accessToken: data.tokens.accessToken, user: data.user });
      router.push("/portal");
    },
  });

  // Fetch CSRF token on component mount
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
      <section className="section">
        <div className="container auth-card card">
          <h1>Create account</h1>
          <form
            className="stack"
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
            <label>
              Name
              <input {...form.register("name")} placeholder="Your full name" />
            </label>
            <label>
              Email
              <input {...form.register("email")} placeholder="you@company.com" />
            </label>
            <label>
              Phone
              <input {...form.register("phone")} placeholder="+91 98765 43210" />
            </label>
            <label>
              Password
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input 
                  {...form.register("password")} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="At least 8 characters"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </label>
            {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
            {formError ? <p className="field-error">{formError}</p> : null}
            <button className="primary-button" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create account"}
            </button>
          </form>
          <p>
            Already have access? <Link href="/login">Login</Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
