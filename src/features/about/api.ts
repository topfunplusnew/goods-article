import { getServerEnv } from "@/config/env";
import type {
  AboutDetailDto,
  AboutListDto,
} from "@/features/about/contracts";
import {
  mapAboutDetailDtoToModel,
  mapAboutListDtoToModel,
} from "@/features/about/mapper";

export async function getAboutList() {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/abouts`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`About list request failed: ${response.status}`);
  }

  const body = (await response.json()) as AboutListDto[];
  return body.map(mapAboutListDtoToModel);
}

export async function getAboutById(aboutId: string) {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/abouts/${aboutId}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`About detail request failed: ${response.status}`);
  }

  const body = (await response.json()) as AboutDetailDto;
  return mapAboutDetailDtoToModel(body);
}
