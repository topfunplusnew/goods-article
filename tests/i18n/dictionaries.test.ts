import assert from "node:assert/strict";
import test from "node:test";

import { getDictionary } from "../../src/i18n/server";

test("supported locales resolve explicit dictionaries", async () => {
  const en = await getDictionary("en");
  const zh = await getDictionary("zh");

  assert.equal(typeof en.common.site_name, "string");
  assert.equal(typeof zh.common.site_name, "string");
});
