import { PageSection } from "@/shared/components/common/PageSection";
import { LoginForm } from "@/features/auth/LoginForm";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function LoginPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.nav.sign_in}
      title={dictionary.user.login_title}
      description={dictionary.user.login_description}
    >
      <LoginForm
        usernameLabel={dictionary.user.username}
        usernamePlaceholder={dictionary.user.username_placeholder}
        passwordLabel={dictionary.user.password_placeholder}
        passwordPlaceholder={dictionary.user.password_placeholder}
        loginLabel={dictionary.user.login}
        loadingLabel={dictionary.common.loading}
        loginFailedLabel={dictionary.user.login_failed}
      />
    </PageSection>
  );
}
