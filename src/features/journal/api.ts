import { getServerEnv } from "@/config/env";
import type { JournalDto } from "@/features/journal/contracts";
import { mapJournalDtoToModel } from "@/features/journal/mapper";

export async function getJournal() {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/journals`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Journal request failed: ${response.status}`);
  }

  const body = (await response.json()) as JournalDto;
  return mapJournalDtoToModel(body);
}
