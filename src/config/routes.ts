export const PUBLIC_ROUTES = {
  home: "/",
  articles: "/article",
  articleSearch: "/article/search",
  issues: "/all-issues",
  authors: "/authors",
  about: "/about",
  publish: "/publish",
  login: "/login",
  profile: "/user/me",
} as const;

export const ADMIN_ROUTES = {
  home: "/admin",
  login: "/admin/login",
  account: "/admin/account",
  articles: "/admin/articles",
  issues: "/admin/issues",
  volumes: "/admin/volumes",
  journal: "/admin/journal",
  about: "/admin/about",
  publish: "/admin/publish",
  publishing: "/admin/publishing",
  staticAssets: "/admin/static-assets",
  deploy: "/admin/deploy",
} as const;
