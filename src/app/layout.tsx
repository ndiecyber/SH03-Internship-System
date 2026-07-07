import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: {
    default: "LEXA Internship Management System",
    template: "%s | LEXA IMS"
  },
  description: "Enterprise internship lifecycle management for LEXA."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppSessionProvider>
          {children}
        </AppSessionProvider>
      </body>
    </html>
  );
}
