import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/routes";

export default function AdminArticleEditPage() {
  redirect(ADMIN_ROUTES.articles);
}
