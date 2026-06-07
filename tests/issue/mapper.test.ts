import assert from "node:assert/strict";
import test from "node:test";

import { resolveIssueCoverImageUrl } from "../../src/features/issue/assets";
import { mapIssueDetailDtoToModel, mapIssueListDtoToModel } from "../../src/features/issue/mapper";

test("mapIssueListDtoToModel preserves current and published state", () => {
  const model = mapIssueListDtoToModel({
    volume_id: 6,
    issue_number: 1,
    title: null,
    cover_image: "/uploads/issues/30/cover.png",
    publish_date: null,
    id: 30,
    volume_number: 1,
    is_current: true,
    published: true,
    created_at: "2026-05-21T02:56:41.143229Z",
    updated_at: "2026-06-01T01:56:53.235342Z",
    articles_count: 0,
  });

  assert.equal(model.id, 30);
  assert.equal(model.isCurrent, true);
  assert.equal(model.published, true);
});

test("mapIssueDetailDtoToModel maps nested article list", () => {
  const model = mapIssueDetailDtoToModel({
    volume_id: 6,
    issue_number: 1,
    title: null,
    cover_image: "/uploads/issues/30/cover.png",
    publish_date: null,
    id: 30,
    volume_number: 1,
    is_current: true,
    published: true,
    created_at: "2026-05-21T02:56:41.143229Z",
    updated_at: "2026-06-01T01:56:53.235342Z",
    articles_count: 8,
    articles: [
      {
        id: 94,
        title: "An Empirical Study",
        article_type: "regular",
        access: true,
        authors: ["Ma Jimei"],
        page_start: null,
        page_end: null,
        order_in_issue: 0,
        published_date: null,
        view_count: 94,
        download_count: 3,
      },
    ],
  });

  assert.equal(model.articles.length, 1);
  assert.equal(model.articles[0]?.id, 94);
});

test("resolveIssueCoverImageUrl normalizes legacy image upload paths", () => {
  assert.equal(
    resolveIssueCoverImageUrl("/images/uploads/issues/cover.png"),
    "/uploads/issues/cover.png",
  );
  assert.equal(
    resolveIssueCoverImageUrl("/uploads/issues/cover.png"),
    "/uploads/issues/cover.png",
  );
  assert.equal(resolveIssueCoverImageUrl(null), "");
});
