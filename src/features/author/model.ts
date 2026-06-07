export interface AuthorListItem {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  displayName: string;
  email: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface AuthorArticleSummary {
  id: number;
  title: string;
  doi: string | null;
}

export interface AuthorDetail {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  displayName: string;
  email: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  articles: AuthorArticleSummary[];
}
