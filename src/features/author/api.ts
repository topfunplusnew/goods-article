import { getServerEnv } from "@/config/env";
import type {
  AuthorDetailDto,
  AuthorListDto,
} from "@/features/author/contracts";
import {
  mapAuthorDetailDtoToModel,
  mapAuthorListDtoToModel,
} from "@/features/author/mapper";

export async function getAuthors() {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/authors`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Author list request failed: ${response.status}`);
  }

  const body = (await response.json()) as AuthorListDto[];
  return body.map(mapAuthorListDtoToModel);
}

export async function getAuthorById(authorId: string) {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/authors/${authorId}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Author detail request failed: ${response.status}`);
  }

  const body = (await response.json()) as AuthorDetailDto;
  return mapAuthorDetailDtoToModel(body);
}
