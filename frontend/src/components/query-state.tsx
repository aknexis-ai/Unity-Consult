"use client";

import { ReactNode } from "react";

export function QueryState<T>({
  data,
  isLoading,
  error,
  emptyMessage,
  children,
}: {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  emptyMessage: string;
  children: (data: T[]) => ReactNode;
}) {
  if (isLoading) {
    return <section className="card">Loading live records...</section>;
  }

  if (error) {
    return <section className="card error-card">{error.message}</section>;
  }

  if (!data?.length) {
    return <section className="card">{emptyMessage}</section>;
  }

  return <>{children(data)}</>;
}
