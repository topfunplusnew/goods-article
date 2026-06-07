import type { ArticleListDto } from "@/features/article/contracts";

export interface IssueListDto {
  volume_id: number;
  issue_number: number;
  title: string | null;
  cover_image: string | null;
  publish_date: string | null;
  id: number;
  volume_number: number;
  is_current: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  articles_count: number;
}

export interface IssueDetailDto extends IssueListDto {
  articles: ArticleListDto[];
}
