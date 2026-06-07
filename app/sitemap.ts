import type { MetadataRoute } from "next";

import { getServerEnv } from "@/config/env";
import type { AboutListDto } from "@/features/about/contracts";
import type { IssueDetailDto, IssueListDto } from "@/features/issue/contracts";
import type { PublishListDto } from "@/features/publish/contracts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const env = getServerEnv();
  const [issuesResponse, aboutsResponse, publishesResponse] = await Promise.all([
    fetch(`${env.internalApiBaseUrl}/issues`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    }),
    fetch(`${env.internalApiBaseUrl}/abouts`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    }),
    fetch(`${env.internalApiBaseUrl}/publishes`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    }),
  ]);

  if (!issuesResponse.ok) {
    throw new Error(`Sitemap issues request failed: ${issuesResponse.status}`);
  }
  if (!aboutsResponse.ok) {
    throw new Error(`Sitemap abouts request failed: ${aboutsResponse.status}`);
  }
  if (!publishesResponse.ok) {
    throw new Error(`Sitemap publishes request failed: ${publishesResponse.status}`);
  }

  const issues = (await issuesResponse.json()) as IssueListDto[];
  const abouts = (await aboutsResponse.json()) as AboutListDto[];
  const publishes = (await publishesResponse.json()) as PublishListDto[];

  const issueDetails = await Promise.all(
    issues.map(async (issue) => {
      const response = await fetch(`${env.internalApiBaseUrl}/issues/${issue.id}`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Sitemap issue detail request failed: ${response.status}`);
      }

      return (await response.json()) as IssueDetailDto;
    }),
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${env.publicSiteUrl}/`,
    },
    {
      url: `${env.publicSiteUrl}/about`,
    },
    {
      url: `${env.publicSiteUrl}/all-issues`,
    },
    {
      url: `${env.publicSiteUrl}/article`,
    },
  ];

  for (const issue of issues) {
    entries.push({
      url: `${env.publicSiteUrl}/issue/${issue.id}`,
      lastModified: issue.updated_at,
    });
  }

  for (const issue of issueDetails) {
    for (const article of issue.articles) {
      entries.push({
        url: `${env.publicSiteUrl}/article/${article.id}`,
        lastModified: issue.updated_at,
      });
    }
  }

  for (const about of abouts) {
    entries.push({
      url: `${env.publicSiteUrl}/about/${about.slug}`,
    });
  }

  for (const publish of publishes) {
    entries.push({
      url: `${env.publicSiteUrl}/publish/${publish.id}`,
    });
  }

  return entries;
}
