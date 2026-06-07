import assert from "node:assert/strict";
import test from "node:test";

import {
  readAuthTokenFromCookieHeader,
  resolveSafeRedirectTarget,
} from "../../src/features/auth/session";

test("readAuthTokenFromCookieHeader extracts the configured token", () => {
  const token = readAuthTokenFromCookieHeader("theme=light; authToken=abc123; Path=/");
  assert.equal(token, "abc123");
});

test("resolveSafeRedirectTarget keeps safe local paths only", () => {
  assert.equal(resolveSafeRedirectTarget("/admin/articles"), "/admin/articles");
  assert.equal(resolveSafeRedirectTarget("https://evil.example.com"), "/");
});
