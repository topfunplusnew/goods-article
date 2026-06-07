import { getServerEnv } from "@/config/env";
import type {
  ArticleDetailDto,
  ArticleListDto,
} from "@/features/article/contracts";
import {
  mapArticleDetailDtoToModel,
  mapArticleListDtoToModel,
} from "@/features/article/mapper";

export async function searchArticles(params: {
  q?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}) {
  const env = getServerEnv();
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }
  if (params.keyword) {
    searchParams.set("keyword", params.keyword);
  }
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.pageSize ?? 10));

  const response = await fetch(
    `${env.internalApiBaseUrl}/articles/search?${searchParams.toString()}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Article search request failed: ${response.status}`);
  }

  const body = (await response.json()) as ArticleListDto[];
  return body.map(mapArticleListDtoToModel);
}

export async function getLatestArticles(limit: number) {
  return searchArticles({
    page: 1,
    pageSize: limit,
  });
}

export async function getPopularArticles(limit: number) {
  const env = getServerEnv();
  const response = await fetch(
    `${env.internalApiBaseUrl}/articles/popular?limit=${limit}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Popular articles request failed: ${response.status}`);
  }

  const body = (await response.json()) as ArticleListDto[];
  return body.map(mapArticleListDtoToModel);
}

export async function getArticlesByIssue(issueId: string) {
  const env = getServerEnv();
  const response = await fetch(
    `${env.internalApiBaseUrl}/articles/issue/${issueId}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Issue article list request failed: ${response.status}`);
  }

  const body = (await response.json()) as ArticleListDto[];
  return body.map(mapArticleListDtoToModel);
}

export async function getArticleById(articleId: string) {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/articles/${articleId}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Article detail request failed: ${response.status}`);
  }

  const body = (await response.json()) as ArticleDetailDto;
  return mapArticleDetailDtoToModel(body);
}
