import assert from "node:assert/strict";
import test from "node:test";

import {
  getStaticAssetMap,
  getStaticAssetDtos,
} from "../../src/server/repository";

test("static assets are read from the sqlite-backed repository", () => {
  const assets = getStaticAssetMap();

  assert.ok(assets["brand.logoSvg"]);
  assert.ok(assets["brand.logoPng"]);
  assert.ok(assets["journal.fallbackCover"]);
  assert.match(assets["journal.fallbackCover"] ?? "", /^\/(?:cover\.png|uploads\/static-assets\/)/);
});

test("static asset list exposes admin-editable metadata", () => {
  const assets = getStaticAssetDtos();
  const logo = assets.find((asset) => asset.key === "brand.logoSvg");

  assert.equal(logo?.label, "Primary SVG logo");
  assert.equal(logo?.mime_type, "image/svg+xml");
});
