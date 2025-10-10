import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { generatePageMetadata, generateOrganizationSchema } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "ChurchDonate - Simplified Church Giving",
    description:
      "Create and manage church donation pages with QR codes. ChurchDonate makes church giving easy, secure, and accessible. Trusted by churches worldwide.",
    path: "/",
  }),
  icons: {
    icon: [
      { url: "/logos/church-donate-web-logo.svg", type: "image/svg+xml" },
      { url: "/logos/church-donate-web-logo.png", type: "image/png" },
    ],
    apple: "/logos/church-donate-web-logo.png",
    shortcut: "/logos/church-donate-web-logo.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
