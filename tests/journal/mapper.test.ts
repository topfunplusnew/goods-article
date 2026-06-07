import assert from "node:assert/strict";
import test from "node:test";

import { mapJournalDtoToModel } from "../../src/features/journal/mapper";

test("mapJournalDtoToModel preserves explicit journal fields from the live backend shape", () => {
  const model = mapJournalDtoToModel({
    id: 1,
    title: "Artificial Intelligence for Education",
    description: "Journal description",
    cover_image: "/uploads/journals/1/cover.png",
    overview: "<p>Overview</p>",
    issn: null,
    publisher: "Association of Global Intelligent Science and Technology",
    publishing_mode: "Gold Open Access",
    impact_factor: null,
    impact_factor_5year: null,
    submission_to_decision_days: null,
    downloads: 0,
    created_at: "2026-05-14T04:29:06.553512Z",
    updated_at: "2026-05-19T13:55:06.843980Z",
  });

  assert.equal(model.id, 1);
  assert.equal(model.title, "Artificial Intelligence for Education");
  assert.equal(model.publisher, "Association of Global Intelligent Science and Technology");
  assert.equal(model.publishingMode, "Gold Open Access");
});
