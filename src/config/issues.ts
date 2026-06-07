export const ISSUE_FORM_DEFAULTS = {
  volumeId: 1,
  volumeNumber: 1,
  issueNumber: 1,
  title: "",
  coverImage: "",
  publishDate: "",
  isCurrent: false,
  published: false,
} as const;

export const ISSUE_COVER_UPLOAD = {
  directoryName: "issues",
  legacyPublicPathPrefix: "/images/uploads/issues",
  publicPathPrefix: "/uploads/issues",
} as const;
