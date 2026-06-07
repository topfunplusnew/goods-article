export interface AboutListItem {
  id: number;
  slug: string;
  label: string;
  labelCn: string;
  orderIndex: number;
}

export interface AboutDetail {
  id: number;
  journalId: number;
  title: string;
  titleCn: string;
  slug: string;
  content: string;
  contentCn: string;
  orderIndex: number;
}
