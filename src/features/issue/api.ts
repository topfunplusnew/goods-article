import { getServerEnv } from "@/config/env";
import type { IssueDetailDto, IssueListDto } from "@/features/issue/contracts";
import {
  mapIssueDetailDtoToModel,
  mapIssueListDtoToModel,
} from "@/features/issue/mapper";

export async function getIssues() {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/issues`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Issue list request failed: ${response.status}`);
  }

  const body = (await response.json()) as IssueListDto[];
  return body.map(mapIssueListDtoToModel);
}

export async function getIssueById(issueId: string) {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/issues/${issueId}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Issue detail request failed: ${response.status}`);
  }

  const body = (await response.json()) as IssueDetailDto;
  return mapIssueDetailDtoToModel(body);
}
