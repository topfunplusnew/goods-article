import assert from "node:assert/strict";
import test from "node:test";

import { getServerEnv } from "../../src/config/env";

test("getServerEnv exposes required runtime keys", () => {
  const previousBackendOrigin = process.env.BACKEND_ORIGIN;
  const previousPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const previousPublicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const previousInternalApiBaseUrl = process.env.INTERNAL_API_BASE_URL;

  process.env.BACKEND_ORIGIN = "https://backend.example.com";
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.ai4e.org";
  process.env.NEXT_PUBLIC_API_BASE_URL = "/api/v1";
  process.env.INTERNAL_API_BASE_URL = "https://backend.example.com/api/v1";

  try {
    const env = getServerEnv();

    assert.equal(env.backendOrigin, "https://backend.example.com");
    assert.equal(env.publicSiteUrl, "https://www.ai4e.org");
    assert.equal(env.publicApiBaseUrl, "/api/v1");
    assert.equal(env.internalApiBaseUrl, "https://backend.example.com/api/v1");
  } finally {
    process.env.BACKEND_ORIGIN = previousBackendOrigin;
    process.env.NEXT_PUBLIC_SITE_URL = previousPublicSiteUrl;
    process.env.NEXT_PUBLIC_API_BASE_URL = previousPublicApiBaseUrl;
    process.env.INTERNAL_API_BASE_URL = previousInternalApiBaseUrl;
  }
});
