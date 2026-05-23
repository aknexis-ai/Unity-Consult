"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { PageTransition } from "./page-transition";
import { ScrollProgress } from "./motion-primitives";

export function Providers({ children }: { children: ReactNode }) {
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
      <ScrollProgress />
      <PageTransition>
        {children}
      </PageTransition>
    </QueryClientProvider>
  );
}
