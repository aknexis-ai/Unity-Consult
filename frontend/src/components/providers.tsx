"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { MaskedTransition } from "./gsap/masked-transition";
import { ScrollProgress } from "./motion-primitives";
import { LenisProvider } from "./gsap/lenis-provider";
import { PageLoader } from "./gsap/page-loader";
import { registerGSAP } from "@/lib/gsap/config";

export function Providers({ children }: { children: ReactNode }) {
  // Register GSAP plugins client-side once
  useEffect(() => { registerGSAP(); }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LenisProvider>
        <PageLoader />
        <ScrollProgress />
        <MaskedTransition>
          {children}
        </MaskedTransition>
      </LenisProvider>
    </QueryClientProvider>
  );
}
