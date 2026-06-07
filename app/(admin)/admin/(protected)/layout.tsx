import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, AUTH_TOKEN_COOKIE_NAME } from "@/config/auth";
import { TheAdminSidebar } from "@/shared/components/layout/TheAdminSidebar";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface ProtectedAdminLayoutProps {
  children: ReactNode;
}

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (!authToken) {
    redirect(ADMIN_LOGIN_PATH);
  }

  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <main className="flex-1 px-0 py-8 lg:py-10">
      <div className="page-container flex max-w-[1280px] flex-col gap-8 lg:flex-row">
        <TheAdminSidebar dictionary={dictionary} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
