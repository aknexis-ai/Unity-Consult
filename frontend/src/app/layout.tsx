import type { Metadata } from "next";
import { Sora } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";
import "../styles/aurora.css";

// Attractive display face for hero / feature headlines (exposed as --font-display).
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

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
    <html lang="en" data-scroll-behavior="smooth" data-theme="light" className={sora.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{document.documentElement.dataset.theme='light';localStorage.setItem('uc-theme','light');}catch(e){document.documentElement.dataset.theme='light';}})();",
          }}
        />
      </head>
      <body>
        <Providers>
          <div className="layout-wrapper">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
