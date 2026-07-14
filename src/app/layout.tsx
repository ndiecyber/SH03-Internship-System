import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <AppSessionProvider>
          {children}
        </AppSessionProvider>
      </body>
    </html>
  );
}
