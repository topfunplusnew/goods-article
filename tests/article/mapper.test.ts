import assert from "node:assert/strict";
import test from "node:test";

import {
  mapArticleDetailDtoToModel,
  mapArticleListDtoToModel,
} from "../../src/features/article/mapper";

test("mapArticleListDtoToModel flips two-part author strings to given-family order", () => {
  const model = mapArticleListDtoToModel({
    id: 92,
    title:
      "K21 as a Finite Educational Backbone in the Age of AI: Toward an AI-Integrated Lifelong Learning Architecture",
    article_type: "regular",
    access: true,
    authors: ["Liu Sixiu", "Xu Yiteng"],
    page_start: null,
    page_end: null,
    order_in_issue: 0,
    published_date: null,
    view_count: 72,
    download_count: 2,
  });

  assert.deepEqual(model.authors, ["Sixiu Liu", "Yiteng Xu"]);
  assert.equal(model.type, "regular");
  assert.equal(model.viewCount, 72);
});

test("mapArticleDetailDtoToModel merges issue and volume fields into a single issue model", () => {
  const model = mapArticleDetailDtoToModel({
    id: 95,
    title:
      "Teaching Reinforcement Learning in Large-Scale Interdisciplinary Classrooms: A Course Design and Practice",
    article_type: "regular",
    access: true,
    abstract: "Reinforcement learning...",
    keywords: ["Reinforcement Learning"],
    authors: [
      {
        id: 44,
        first_name: "Lili",
        last_name: "Fan",
        display_name: "Fan Lili",
        is_corresponding: false,
      },
    ],
    issue: {
      id: 30,
      issue_number: 1,
      cover_image: "/uploads/issues/30/cover.png",
      is_current: true,
    },
    volume: {
      id: 6,
      volume_number: 1,
      year: 2026,
    },
    view_count: 60,
    download_count: 10,
    created_at: "2026-06-04T04:05:57.658174Z",
    funds: [],
  });

  assert.equal(model.issue?.id, 30);
  assert.equal(model.issue?.issueNumber, 1);
  assert.equal(model.issue?.volumeNumber, 1);
  assert.equal(model.authors[0]?.displayName, "Fan Lili");
});
