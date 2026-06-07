import { JOURNAL_COVER_UPLOAD } from "@/config/journal";

export function resolveJournalCoverImageUrl(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  if (value.startsWith(JOURNAL_COVER_UPLOAD.legacyPublicPathPrefix)) {
    return `${JOURNAL_COVER_UPLOAD.publicPathPrefix}${value.slice(JOURNAL_COVER_UPLOAD.legacyPublicPathPrefix.length)}`;
  }

  return value;
}
