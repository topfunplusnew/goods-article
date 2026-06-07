import { redirect } from "next/navigation";

import { getPublishList } from "@/features/publish/api";
import { PUBLIC_ROUTES } from "@/config/routes";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function PublishIndexPage() {
  getServerLocale();
  await getDictionary("en");
  const publishList = await getPublishList();
  const firstPublish = [...publishList].sort(
    (left, right) => left.orderIndex - right.orderIndex,
  )[0];

  if (!firstPublish) {
    redirect(PUBLIC_ROUTES.home);
  }

  redirect(`${PUBLIC_ROUTES.publish}/${firstPublish.id}`);
}
