import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/routes";

export default function AdminArticleNewPage() {
  redirect(ADMIN_ROUTES.articles);
}
