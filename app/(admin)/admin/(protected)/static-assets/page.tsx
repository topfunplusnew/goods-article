import { AdminStaticAssetsForm } from "@/features/static-assets/AdminStaticAssetsForm";
import { getStaticAssetDtos } from "@/server/repository";
import { PageSection } from "@/shared/components/common/PageSection";

export default function AdminStaticAssetsPage() {
  return (
    <PageSection
      eyebrow="Admin"
      title="Static assets"
      description="Upload and replace front-end assets stored in the local SQLite database."
    >
      <AdminStaticAssetsForm initialAssets={getStaticAssetDtos()} />
    </PageSection>
  );
}
