import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "AlignIQ - Goal Setting & Performance Tracking Portal",
  description:
    "Align goals, approve workflows, and track quarterly performance with clarity.",
  icons: {
    icon: "/assets/brand/aligniq-logo-mark.png",
    apple: "/assets/brand/aligniq-logo-mark.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
