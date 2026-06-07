import type {
  ArticleDetailDto,
  ArticleListDto,
} from "@/features/article/contracts";
import type {
  ArticleDetail,
  ArticleListItem,
} from "@/features/article/model";

function formatListAuthorName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, " ");
  const parts = trimmed.split(" ");

  if (parts.length !== 2) {
    return trimmed;
  }

  const [familyName, givenName] = parts;

  if (!familyName || !givenName) {
    return trimmed;
  }

  return `${givenName} ${familyName}`;
}

export function mapArticleListDtoToModel(dto: ArticleListDto): ArticleListItem {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.article_type,
    authors: dto.authors.map(formatListAuthorName),
    pageStart: dto.page_start,
    pageEnd: dto.page_end,
    publishedDate: dto.published_date,
    viewCount: dto.view_count,
    downloadCount: dto.download_count,
  };
}

export function mapArticleDetailDtoToModel(dto: ArticleDetailDto): ArticleDetail {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.article_type,
    abstract: dto.abstract,
    keywords: dto.keywords,
    authors: dto.authors.map((author) => ({
      id: author.id,
      firstName: author.first_name,
      lastName: author.last_name,
      displayName: author.display_name,
      isCorresponding: author.is_corresponding,
    })),
    issue:
      dto.issue && dto.volume
        ? {
            id: dto.issue.id,
            issueNumber: dto.issue.issue_number,
            volumeNumber: dto.volume.volume_number,
            coverImage: dto.issue.cover_image,
            isCurrent: dto.issue.is_current,
          }
        : null,
    viewCount: dto.view_count,
    downloadCount: dto.download_count,
    createdAt: dto.created_at,
  };
}
