import type { Metadata } from "next";

import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Unity Consult",
  description: "Premium consulting platform for digital services, client delivery, CRM operations, and growth.",
  metadataBase: new URL("https://unityconsult.com"),
  openGraph: {
    title: "Unity Consult",
    description: "Premium consulting platform for digital services, client delivery, CRM operations, and growth.",
    url: "https://unityconsult.com",
    siteName: "Unity Consult",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
