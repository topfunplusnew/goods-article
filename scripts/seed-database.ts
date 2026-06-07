import {
  getArticleDtos,
  getIssueDtos,
  getJournalDto,
  getStaticAssetDtos,
  getVolumeDtos,
} from "../src/server/repository";

const journal = getJournalDto();
const issues = getIssueDtos({ includeUnpublished: true });
const volumes = getVolumeDtos();
const articles = getArticleDtos();
const staticAssets = getStaticAssetDtos();

console.log(JSON.stringify({
  articles: articles.length,
  database: "data/good-papers.sqlite",
  issues: issues.length,
  journal: journal?.title ?? null,
  staticAssets: staticAssets.length,
  volumes: volumes.length,
}, null, 2));
