import type { MetadataRoute } from "next";

import { blogPosts, portfolioItems } from "@/lib/mock-data";
import { services } from "@/lib/services";

const siteUrl = "https://unityconsult.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/pricing",
    "/portfolio",
    "/blog",
    "/about",
    "/contact",
    "/careers",
    "/privacy-policy",
    "/terms-of-service",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: new Date(),
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    })),
    ...portfolioItems.map((item) => ({
      url: `${siteUrl}/portfolio/${item.slug}`,
      lastModified: new Date(),
    })),
  ];
}
