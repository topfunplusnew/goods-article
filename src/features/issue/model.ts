import type { ArticleListItem } from "@/features/article/model";

export interface IssueListItem {
  id: number;
  volumeId: number;
  volumeNumber: number;
  issueNumber: number;
  title: string | null;
  coverImage: string | null;
  publishDate: string | null;
  isCurrent: boolean;
  published: boolean;
  articlesCount: number;
}

export interface IssueDetail {
  id: number;
  volumeId: number;
  volumeNumber: number;
  issueNumber: number;
  title: string | null;
  coverImage: string | null;
  publishDate: string | null;
  isCurrent: boolean;
  published: boolean;
  articlesCount: number;
  articles: ArticleListItem[];
}
