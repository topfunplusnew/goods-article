export interface AboutListDto {
  id: number;
  slug: string;
  label: string;
  label_cn: string;
  order_index: number;
}

export interface AboutDetailDto {
  id: number;
  journal_id: number;
  title: string;
  label: string;
  label_cn: string;
  title_cn: string;
  slug: string;
  content: string;
  content_cn: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}
