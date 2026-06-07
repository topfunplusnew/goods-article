export interface JournalDto {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  overview: string;
  issn: string | null;
  publisher: string;
  publishing_mode: string;
  impact_factor: number | null;
  impact_factor_5year: number | null;
  submission_to_decision_days: number | null;
  downloads: number;
  created_at: string;
  updated_at: string;
}
