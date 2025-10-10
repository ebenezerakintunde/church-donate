import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://churchdonate.org";

/**
 * Generate sitemap for search engines
 * This will be automatically available at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/get-started`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  // You can add dynamic church pages here if you want to include them
  // This would require fetching from your database
  // const churches = await fetchChurches();
  // const churchPages = churches.map(church => ({
  //   url: `${BASE_URL}/church/${church.slug}`,
  //   lastModified: church.updatedAt,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }));

  return [...staticPages];
}
