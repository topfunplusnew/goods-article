import assert from "node:assert/strict";
import test from "node:test";

import { readTranslationProvider } from "../../src/features/translation/provider";

test("readTranslationProvider returns configured provider", () => {
  const provider = readTranslationProvider({
    LOCALE_TRANSLATION_PROVIDER: "google_gtx",
  });

  assert.equal(provider, "google_gtx");
});

test("readTranslationProvider throws for missing provider", () => {
  assert.throws(
    () => readTranslationProvider({}),
    /Missing required environment variable LOCALE_TRANSLATION_PROVIDER/,
  );
});
