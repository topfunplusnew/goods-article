import { PageSection } from "@/shared/components/common/PageSection";
import { UserProfile } from "@/features/auth/UserProfile";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function UserProfilePage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <>
      <PageSection
        eyebrow={dictionary.nav.profile}
        title={dictionary.user.profile}
        description={dictionary.user.profile_hint}
      />
      <UserProfile
        profileLabel={dictionary.user.profile}
        profileHint={dictionary.user.profile_hint}
        loginRequiredLabel={dictionary.user.login_required}
        loginRequiredHint={dictionary.user.login_required_hint}
        loginLabel={dictionary.user.login}
        retryLabel={dictionary.common.retry}
        usernameLabel={dictionary.user.username}
        tokenStatusLabel={dictionary.user.token_status}
        authenticatedLabel={dictionary.user.authenticated}
        memberSinceLabel={dictionary.user.member_since}
        updatedAtLabel={dictionary.article.publish_date}
        logoutLabel={dictionary.nav.sign_out}
      />
    </>
  );
}
