import { Metadata } from "next";

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://churchdonate.org";

// SEO Configuration
export const SEO_CONFIG = {
  siteName: "ChurchDonate",
  title: "ChurchDonate - Simplified Church Giving",
  description:
    "Create and manage church donation pages with QR codes. ChurchDonate makes church giving easy, secure, and accessible. Trusted by churches worldwide.",
  keywords: [
    "church donations",
    "church giving",
    "donation pages",
    "QR code donations",
    "church management",
    "online giving",
    "church profiles",
    "church donation software",
    "church fundraising",
    "non-profit donations",
    "tithe management",
    "church tithes",
    "digital church giving",
    "contactless donations",
    "church payment processing",
  ],
  logo: `${BASE_URL}/logos/church-donate-web-logo.png`,
  icon: `${BASE_URL}/logos/church-donate-web-logo.png`,
  ogImage: `${BASE_URL}/logos/church-donate-web-logo.png`,
  twitterHandle: "@ChurchDonate",
};

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
  ogType?: "website" | "article" | "profile";
}

/**
 * Generate comprehensive SEO metadata for any page
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage = SEO_CONFIG.ogImage,
  noIndex = false,
  keywords = SEO_CONFIG.keywords,
  ogType = "website",
}: PageSEOProps): Metadata {
  const pageTitle = title.includes("ChurchDonate")
    ? title
    : `${title} - ChurchDonate`;
  const url = `${BASE_URL}${path}`;

  return {
    title: pageTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "ChurchDonate Team" }],
    creator: "ChurchDonate",
    publisher: "ChurchDonate",
    applicationName: "ChurchDonate",

    // Robots
    robots: noIndex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",

    // Open Graph
    openGraph: {
      type: ogType,
      locale: "en_US",
      url,
      siteName: SEO_CONFIG.siteName,
      title: pageTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SEO_CONFIG.siteName,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      site: SEO_CONFIG.twitterHandle,
      creator: SEO_CONFIG.twitterHandle,
      title: pageTitle,
      description,
      images: [ogImage],
    },

    // Additional metadata
    alternates: {
      canonical: url,
    },

    // Verification tags (add your verification codes when you have them)
    verification: {
      // google: "your-google-site-verification-code",
      // bing: "your-bing-verification-code",
    },

    // Category
    category: "Technology",

    // Other
    metadataBase: new URL(BASE_URL),
  };
}

/**
 * Generate JSON-LD structured data for the organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_CONFIG.siteName,
    url: BASE_URL,
    logo: SEO_CONFIG.logo,
    description: SEO_CONFIG.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: `${BASE_URL}/contact`,
    },
    sameAs: [
      // Add your social media profiles here when available
      // "https://facebook.com/churchdonate",
      // "https://twitter.com/churchdonate",
      // "https://linkedin.com/company/churchdonate",
    ],
  };
}

/**
 * Generate JSON-LD structured data for a church
 */
export function generateChurchSchema(church: {
  name: string;
  description?: string;
  address?: string;
  logoUrl?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    name: church.name,
    description: church.description || `Donation page for ${church.name}`,
    url: church.url,
    logo: church.logoUrl || SEO_CONFIG.logo,
    address: church.address
      ? {
          "@type": "PostalAddress",
          streetAddress: church.address,
        }
      : undefined,
  };
}

/**
 * Generate JSON-LD structured data for software application
 */
export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SEO_CONFIG.siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "50",
      priceCurrency: "EUR",
      priceValidUntil: "2026-12-31",
    },
    description: SEO_CONFIG.description,
    url: BASE_URL,
    image: SEO_CONFIG.ogImage,
  };
}

/**
 * Generate FAQ schema for a page
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
