import type {
  AuthorDetailDto,
  AuthorListDto,
} from "@/features/author/contracts";
import type {
  AuthorDetail,
  AuthorListItem,
} from "@/features/author/model";

export function mapAuthorListDtoToModel(dto: AuthorListDto): AuthorListItem {
  return {
    id: dto.id,
    firstName: dto.first_name,
    middleName: dto.middle_name,
    lastName: dto.last_name,
    displayName: dto.display_name,
    email: dto.email,
    avatar: dto.avatar,
    createdAt: dto.created_at,
  };
}

export function mapAuthorDetailDtoToModel(dto: AuthorDetailDto): AuthorDetail {
  return {
    id: dto.id,
    firstName: dto.first_name,
    middleName: dto.middle_name,
    lastName: dto.last_name,
    displayName: dto.display_name,
    email: dto.email,
    avatar: dto.avatar,
    bio: dto.bio,
    createdAt: dto.created_at,
    articles: dto.articles.map((entry) => ({
      id: entry.article.id,
      title: entry.article.title,
      doi: entry.article.doi,
    })),
  };
}
