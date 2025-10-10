import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://churchdonate.org";

/**
 * Generate robots.txt for search engines
 * This will be automatically available at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/pricing", "/contact", "/get-started"],
        disallow: [
          "/admin/*",
          "/api/*",
          "/manage/*",
          "/admin/",
          "/api/",
          "/manage/",
        ],
      },
      // Allow specific search engines full access to public pages
      {
        userAgent: "Googlebot",
        allow: ["/", "/church/*"],
        disallow: ["/admin/*", "/api/*", "/manage/*"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/church/*"],
        disallow: ["/admin/*", "/api/*", "/manage/*"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
