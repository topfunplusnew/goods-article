import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export function buildBaseMetadata(): Metadata {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    applicationName: siteConfig.title,
    authors: [{ name: siteConfig.title }],
    publisher: siteConfig.publisher,
  };
}
