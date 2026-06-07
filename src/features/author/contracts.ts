export interface AuthorListDto {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  display_name: string;
  orcid: string | null;
  avatar: string | null;
  email: string | null;
  affiliation: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthorDetailDto extends AuthorListDto {
  affiliations: Array<unknown>;
  articles: Array<{
    article_id: number;
    author_id: number;
    is_corresponding: boolean;
    author_order: number;
    article: {
      id: number;
      title: string;
      doi: string | null;
    };
  }>;
}
