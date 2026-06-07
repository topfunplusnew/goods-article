import { ISSUE_COVER_UPLOAD } from "@/config/issues";

export function resolveIssueCoverImageUrl(value: string | null): string {
  if (!value) {
    return "";
  }

  if (value.startsWith(ISSUE_COVER_UPLOAD.legacyPublicPathPrefix)) {
    return `${ISSUE_COVER_UPLOAD.publicPathPrefix}${value.slice(ISSUE_COVER_UPLOAD.legacyPublicPathPrefix.length)}`;
  }

  return value;
}
