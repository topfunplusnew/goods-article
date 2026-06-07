import assert from "node:assert/strict";
import test from "node:test";

import robots from "../../app/robots";

test("robots metadata exposes sitemap and public crawl rules", () => {
  process.env.BACKEND_ORIGIN = "https://www.ai4edu-j.org";
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.ai4e.org";
  process.env.NEXT_PUBLIC_API_BASE_URL = "/api/v1";
  process.env.INTERNAL_API_BASE_URL = "https://www.ai4edu-j.org/api/v1";

  const metadata = robots();

  assert.equal(metadata.sitemap, "https://www.ai4e.org/sitemap.xml");
  assert.equal(Array.isArray(metadata.rules), true);
});
