import assert from "node:assert/strict";
import test from "node:test";

import {
  mapAboutDetailDtoToModel,
  mapAboutListDtoToModel,
} from "../../src/features/about/mapper";

test("mapAboutListDtoToModel preserves public navigation fields", () => {
  const model = mapAboutListDtoToModel({
    id: 48,
    slug: "journal-information",
    label: "Journal Information",
    label_cn: "期刊信息",
    order_index: 1,
  });

  assert.equal(model.slug, "journal-information");
  assert.equal(model.label, "Journal Information");
});

test("mapAboutDetailDtoToModel preserves html content fields", () => {
  const model = mapAboutDetailDtoToModel({
    id: 48,
    journal_id: 1,
    title: "Artificial Intelligence for Education",
    label: "Journal Information",
    label_cn: "期刊信息",
    title_cn: "",
    slug: "journal-information",
    content: "<h3>About the Journal</h3>",
    content_cn: "<h3>期刊简介</h3>",
    order_index: 1,
    created_at: "2026-05-14T16:23:29.768828Z",
    updated_at: "2026-05-20T15:34:02.660657Z",
  });

  assert.equal(model.id, 48);
  assert.equal(model.content, "<h3>About the Journal</h3>");
});
