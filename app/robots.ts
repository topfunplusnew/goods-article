import type { MetadataRoute } from "next";

import { getServerEnv } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  const env = getServerEnv();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/article/",
          "/article",
          "/issue/",
          "/all-issues",
          "/about/",
          "/publish/",
          "/api/v1/articles/*/download",
          "/api/v1/articles/*/view",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/article/search",
          "/login",
          "/user/",
          "/author/",
        ],
      },
    ],
    sitemap: `${env.publicSiteUrl}/sitemap.xml`,
  };
}
