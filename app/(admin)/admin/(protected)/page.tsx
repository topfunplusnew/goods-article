import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/routes";

export default function AdminHomePage() {
  redirect(ADMIN_ROUTES.articles);
}
