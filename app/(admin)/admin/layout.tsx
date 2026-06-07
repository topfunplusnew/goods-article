import type { ReactNode } from "react";

import { TheFooter } from "@/shared/components/layout/TheFooter";
import { TheNavbar } from "@/shared/components/layout/TheNavbar";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface AdminRootLayoutProps {
  children: ReactNode;
}

export default async function AdminRootLayout({
  children,
}: AdminRootLayoutProps) {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TheNavbar dictionary={dictionary} />
      {children}
      <TheFooter
        runtimeNote={dictionary.footer.runtime_note}
        siteName={dictionary.common.site_name}
      />
    </div>
  );
}
