import { Suspense } from "react";

import { PageSection } from "@/shared/components/common/PageSection";
import { LoginForm } from "@/features/auth/LoginForm";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function AdminLoginPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <main className="flex-1 px-0 py-8 lg:py-10">
      <div className="page-container">
        <PageSection
          eyebrow={dictionary.admin.title}
          title={dictionary.admin.login_title}
          description={dictionary.admin.login_description}
        >
          <Suspense fallback={null}>
            <LoginForm
              usernameLabel={dictionary.user.username}
              usernamePlaceholder={dictionary.user.username_placeholder}
              passwordLabel={dictionary.user.password_placeholder}
              passwordPlaceholder={dictionary.user.password_placeholder}
              loginLabel={dictionary.user.login}
              loadingLabel={dictionary.common.loading}
              loginFailedLabel={dictionary.user.login_failed}
            />
          </Suspense>
        </PageSection>
      </div>
    </main>
  );
}
