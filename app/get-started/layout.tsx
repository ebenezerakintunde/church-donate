import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Get Started | ChurchDonate",
  description:
    "Join ChurchDonate and create your church’s official giving profile. We’ll guide you through setting up your page with verified account details, a personalized profile, and a ready-to-use QR code for easy sharing.",
  path: "/get-started",
  keywords: [
    "church donate",
    "church giving page",
    "church donation setup",
    "create church profile",
    "church QR code",
    "start church donation page",
    "church donation platform",
    "church onboarding",
    "ChurchDonate setup",
  ],
});

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
