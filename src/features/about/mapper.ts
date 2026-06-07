import type {
  AboutDetailDto,
  AboutListDto,
} from "@/features/about/contracts";
import type {
  AboutDetail,
  AboutListItem,
} from "@/features/about/model";

export function mapAboutListDtoToModel(dto: AboutListDto): AboutListItem {
  return {
    id: dto.id,
    slug: dto.slug,
    label: dto.label,
    labelCn: dto.label_cn,
    orderIndex: dto.order_index,
  };
}

export function mapAboutDetailDtoToModel(dto: AboutDetailDto): AboutDetail {
  return {
    id: dto.id,
    journalId: dto.journal_id,
    title: dto.title,
    titleCn: dto.title_cn,
    slug: dto.slug,
    content: dto.content,
    contentCn: dto.content_cn,
    orderIndex: dto.order_index,
  };
}
