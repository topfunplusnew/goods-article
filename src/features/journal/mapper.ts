import type { JournalDto } from "@/features/journal/contracts";
import type { JournalDetail } from "@/features/journal/model";

export function mapJournalDtoToModel(dto: JournalDto): JournalDetail {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    coverImage: dto.cover_image,
    overview: dto.overview,
    issn: dto.issn,
    publisher: dto.publisher,
    publishingMode: dto.publishing_mode,
    impactFactor: dto.impact_factor,
    impactFactor5Year: dto.impact_factor_5year,
    submissionToDecisionDays: dto.submission_to_decision_days,
    downloads: dto.downloads,
  };
}
