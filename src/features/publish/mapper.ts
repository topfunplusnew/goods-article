import type {
  PublishDetailDto,
  PublishListDto,
} from "@/features/publish/contracts";
import type {
  PublishDetail,
  PublishListItem,
} from "@/features/publish/model";

export function mapPublishListDtoToModel(dto: PublishListDto): PublishListItem {
  return {
    id: dto.id,
    slug: dto.slug,
    label: dto.label,
    labelCn: dto.label_cn,
    orderIndex: dto.order_index,
  };
}

export function mapPublishDetailDtoToModel(dto: PublishDetailDto): PublishDetail {
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
