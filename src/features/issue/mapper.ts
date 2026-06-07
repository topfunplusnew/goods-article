import { mapArticleListDtoToModel } from "@/features/article/mapper";
import type {
  IssueDetailDto,
  IssueListDto,
} from "@/features/issue/contracts";
import type {
  IssueDetail,
  IssueListItem,
} from "@/features/issue/model";

export function mapIssueListDtoToModel(dto: IssueListDto): IssueListItem {
  return {
    id: dto.id,
    volumeId: dto.volume_id,
    volumeNumber: dto.volume_number,
    issueNumber: dto.issue_number,
    title: dto.title,
    coverImage: dto.cover_image,
    publishDate: dto.publish_date,
    isCurrent: dto.is_current,
    published: dto.published,
    articlesCount: dto.articles_count,
  };
}

export function mapIssueDetailDtoToModel(dto: IssueDetailDto): IssueDetail {
  return {
    ...mapIssueListDtoToModel(dto),
    articles: dto.articles.map(mapArticleListDtoToModel),
  };
}
