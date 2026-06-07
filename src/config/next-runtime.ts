interface RewriteEnv {
  BACKEND_ORIGIN?: string | undefined;
}

export function readBackendOriginForRewrites(env: RewriteEnv): string {
  const value = env.BACKEND_ORIGIN;

  if (!value || value.trim().length === 0) {
    throw new Error(
      "Missing required environment variable BACKEND_ORIGIN for Next.js rewrites.",
    );
  }

  return value.trim().replace(/\/+$/, "");
}
