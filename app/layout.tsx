import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChurchDonate - Simplified Church Giving",
  description: "Create and manage church donation pages with QR codes",
  icons: {
    icon: [
      { url: "/logos/icon.svg", type: "image/svg+xml" },
      { url: "/logos/icon.png", type: "image/png" },
    ],
    apple: "/logos/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
