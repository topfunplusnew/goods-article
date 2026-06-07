import Link from "next/link";

import { PUBLIC_ROUTES } from "@/config/routes";
import type { Dictionary } from "@/i18n/server";

interface TheSidebarProps {
  dictionary: Dictionary;
}

export function TheSidebar({ dictionary }: TheSidebarProps) {
  return (
    <aside className="sticky top-6 hidden w-[280px] self-start lg:block">
      <div className="space-y-5">
        <section className="section-shell p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            {dictionary.sidebar.navigation}
          </p>

          <div className="mt-4 space-y-2">
            <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-primary-subtle hover:text-primary" href={PUBLIC_ROUTES.about}>
              {dictionary.nav.about}
            </Link>
            <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-primary-subtle hover:text-primary" href={PUBLIC_ROUTES.authors}>
              {dictionary.nav.authors}
            </Link>
            <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-primary-subtle hover:text-primary" href={PUBLIC_ROUTES.issues}>
              {dictionary.nav.issues}
            </Link>
            <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-primary-subtle hover:text-primary" href={PUBLIC_ROUTES.articleSearch}>
              {dictionary.common.search}
            </Link>
          </div>
        </section>
      </div>
    </aside>
  );
}
