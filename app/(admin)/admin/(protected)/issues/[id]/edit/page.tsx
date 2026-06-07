import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/routes";

export default function AdminIssueEditPage() {
  redirect(ADMIN_ROUTES.issues);
}
