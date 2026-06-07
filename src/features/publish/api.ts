import { getServerEnv } from "@/config/env";
import type {
  PublishDetailDto,
  PublishListDto,
} from "@/features/publish/contracts";
import {
  mapPublishDetailDtoToModel,
  mapPublishListDtoToModel,
} from "@/features/publish/mapper";

export async function getPublishList() {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/publishes`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Publish list request failed: ${response.status}`);
  }

  const body = (await response.json()) as PublishListDto[];
  return body.map(mapPublishListDtoToModel);
}

export async function getPublishById(publishId: string) {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/publishes/${publishId}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Publish detail request failed: ${response.status}`);
  }

  const body = (await response.json()) as PublishDetailDto;
  return mapPublishDetailDtoToModel(body);
}
