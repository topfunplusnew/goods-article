import assert from "node:assert/strict";
import test from "node:test";

import { readBackendOriginForRewrites } from "../../src/config/next-runtime";

test("readBackendOriginForRewrites returns a trimmed origin", () => {
  const origin = readBackendOriginForRewrites({
    BACKEND_ORIGIN: "https://www.ai4edu-j.org/",
  });

  assert.equal(origin, "https://www.ai4edu-j.org");
});

test("readBackendOriginForRewrites throws when BACKEND_ORIGIN is missing", () => {
  assert.throws(
    () => readBackendOriginForRewrites({}),
    /Missing required environment variable BACKEND_ORIGIN/,
  );
});
