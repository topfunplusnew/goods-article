export interface ArticleListDto {
  id: number;
  title: string;
  article_type: string;
  access: boolean;
  authors: string[];
  page_start: number | null;
  page_end: number | null;
  order_in_issue: number | null;
  published_date: string | null;
  view_count: number;
  download_count: number;
}

export interface ArticleDetailAuthorDto {
  id: number;
  first_name: string;
  last_name: string;
  display_name: string;
  is_corresponding: boolean;
}

export interface ArticleDetailIssueDto {
  id: number;
  issue_number: number;
  cover_image?: string;
  is_current: boolean;
}

export interface ArticleDetailVolumeDto {
  id: number;
  volume_number: number;
  year: number;
}

export interface ArticleDetailDto {
  id: number;
  title: string;
  article_type: string;
  access: boolean;
  abstract: string;
  keywords: string[];
  authors: ArticleDetailAuthorDto[];
  issue?: ArticleDetailIssueDto;
  volume?: ArticleDetailVolumeDto;
  page_start?: number | null;
  page_end?: number | null;
  order_in_issue?: number | null;
  published_date?: string | null;
  view_count: number;
  download_count: number;
  created_at: string;
  funds: Array<{
    id: number;
    name: string;
    code?: string | null;
  }>;
}
