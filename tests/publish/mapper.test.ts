import assert from "node:assert/strict";
import test from "node:test";

import {
  mapPublishDetailDtoToModel,
  mapPublishListDtoToModel,
} from "../../src/features/publish/mapper";

test("mapPublishListDtoToModel preserves slug and ordering", () => {
  const model = mapPublishListDtoToModel({
    id: 17,
    slug: "publishing-call-for-papers",
    label: "Call for Papers",
    label_cn: "征稿启事",
    order_index: 1,
  });

  assert.equal(model.slug, "publishing-call-for-papers");
  assert.equal(model.orderIndex, 1);
});

test("mapPublishDetailDtoToModel preserves localized content", () => {
  const model = mapPublishDetailDtoToModel({
    id: 17,
    journal_id: 1,
    title: "Call for Papers",
    label: "Call for Papers",
    label_cn: "征稿启事",
    title_cn: "征稿启事",
    slug: "publishing-call-for-papers",
    content: "<h3>Call for Submissions</h3>",
    content_cn: "string",
    order_index: 1,
    created_at: "2026-05-15T06:50:02.732836",
    updated_at: "2026-05-15T06:50:02.732839",
  });

  assert.equal(model.id, 17);
  assert.equal(model.content, "<h3>Call for Submissions</h3>");
});
