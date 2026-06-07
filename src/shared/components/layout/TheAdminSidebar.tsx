import Link from "next/link";

import { ADMIN_ROUTES } from "@/config/routes";
import type { Dictionary } from "@/i18n/server";

interface TheAdminSidebarProps {
  dictionary: Dictionary;
}

export function TheAdminSidebar({ dictionary }: TheAdminSidebarProps) {
  return (
    <aside className="sticky top-6 hidden w-[240px] shrink-0 self-start lg:block">
      <nav className="space-y-1 rounded-xl border border-border bg-white p-3 shadow-sm">
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.journal}>
          {dictionary.admin.journal}
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.issues}>
          {dictionary.admin.issues}
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.volumes}>
          {dictionary.admin.volumes}
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.about}>
          {dictionary.admin.about_pages}
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.publishing}>
          {dictionary.admin.publishing_pages}
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.articles}>
          {dictionary.admin.articles}
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.staticAssets}>
          Static assets
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.deploy}>
          {dictionary.admin.deploy_center}
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary" href={ADMIN_ROUTES.account}>
          {dictionary.admin.account_security}
        </Link>
      </nav>
    </aside>
  );
}
