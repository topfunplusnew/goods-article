import assert from "node:assert/strict";
import test from "node:test";

import {
  mapAuthorDetailDtoToModel,
  mapAuthorListDtoToModel,
} from "../../src/features/author/mapper";

test("mapAuthorListDtoToModel preserves display name and timestamps", () => {
  const model = mapAuthorListDtoToModel({
    id: 45,
    first_name: "Kaige",
    middle_name: null,
    last_name: "Chen",
    display_name: "Chen Kaige",
    orcid: null,
    avatar: null,
    email: null,
    affiliation: null,
    bio: null,
    created_at: "2026-06-04T04:01:11.462790Z",
    updated_at: "2026-06-04T04:01:11.462793Z",
  });

  assert.equal(model.id, 45);
  assert.equal(model.displayName, "Chen Kaige");
});

test("mapAuthorDetailDtoToModel maps linked article summaries", () => {
  const model = mapAuthorDetailDtoToModel({
    id: 45,
    first_name: "Kaige",
    middle_name: null,
    last_name: "Chen",
    display_name: "Chen Kaige",
    orcid: null,
    avatar: null,
    email: null,
    affiliation: null,
    bio: null,
    created_at: "2026-06-04T04:01:11.462790Z",
    updated_at: "2026-06-04T04:01:11.462793Z",
    affiliations: [],
    articles: [
      {
        article_id: 95,
        author_id: 45,
        is_corresponding: false,
        author_order: 1,
        article: {
          id: 95,
          title:
            "Teaching Reinforcement Learning in Large-Scale Interdisciplinary Classrooms: A Course Design and Practice",
          doi: null,
        },
      },
    ],
  });

  assert.equal(model.articles.length, 1);
  assert.equal(model.articles[0]?.id, 95);
});
