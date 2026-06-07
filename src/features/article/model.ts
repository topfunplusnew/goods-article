export interface ArticleListItem {
  id: number;
  title: string;
  type: string;
  authors: string[];
  pageStart: number | null;
  pageEnd: number | null;
  publishedDate: string | null;
  viewCount: number;
  downloadCount: number;
}

export interface ArticleAuthor {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
  isCorresponding: boolean;
}

export interface ArticleIssueRef {
  id: number;
  issueNumber: number;
  volumeNumber: number;
  coverImage?: string | undefined;
  isCurrent: boolean;
}

export interface ArticleDetail {
  id: number;
  title: string;
  type: string;
  abstract: string;
  keywords: string[];
  authors: ArticleAuthor[];
  issue: ArticleIssueRef | null;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
}
