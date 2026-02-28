import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppProviders } from "@/components/shared/app-providers";

export const metadata: Metadata = {
  title: "ASTU Smart Complaint System",
  description: "Frontend for ASTU Smart Complaint & Issue Tracking System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
