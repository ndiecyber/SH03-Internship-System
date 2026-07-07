"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function AppSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refresh session every 5 minutes
      refetchOnWindowFocus={true} // Refresh on window focus
    >
      {children}
    </SessionProvider>
  );
}
