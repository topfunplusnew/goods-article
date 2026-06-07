export interface JournalDetail {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  overview: string;
  issn: string | null;
  publisher: string;
  publishingMode: string;
  impactFactor: number | null;
  impactFactor5Year: number | null;
  submissionToDecisionDays: number | null;
  downloads: number;
}
