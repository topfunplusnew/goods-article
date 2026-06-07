import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const databaseDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(databaseDirectory, "good-papers.sqlite");

let database: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!database) {
    mkdirSync(databaseDirectory, { recursive: true });
    database = new DatabaseSync(databasePath);
    initializeDatabase(database);
  }

  return database;
}

function initializeDatabase(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      overview TEXT NOT NULL,
      issn TEXT,
      publisher TEXT NOT NULL,
      publishing_mode TEXT NOT NULL,
      impact_factor REAL,
      impact_factor_5year REAL,
      submission_to_decision_days INTEGER,
      downloads INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY,
      volume_id INTEGER NOT NULL,
      volume_number INTEGER NOT NULL,
      issue_number INTEGER NOT NULL,
      title TEXT,
      cover_image TEXT,
      publish_date TEXT,
      is_current INTEGER NOT NULL,
      published INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS volumes (
      id INTEGER PRIMARY KEY,
      journal_id INTEGER NOT NULL,
      volume_number INTEGER NOT NULL,
      year INTEGER NOT NULL,
      published INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      article_type TEXT NOT NULL,
      access INTEGER NOT NULL,
      abstract TEXT NOT NULL,
      keywords_json TEXT NOT NULL,
      authors_json TEXT NOT NULL,
      detail_authors_json TEXT NOT NULL,
      issue_id INTEGER,
      page_start INTEGER,
      page_end INTEGER,
      order_in_issue INTEGER,
      published_date TEXT,
      view_count INTEGER NOT NULL,
      download_count INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      funds_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY,
      first_name TEXT NOT NULL,
      middle_name TEXT,
      last_name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      orcid TEXT,
      avatar TEXT,
      email TEXT,
      affiliation TEXT,
      bio TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS abouts (
      id INTEGER PRIMARY KEY,
      journal_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      label TEXT NOT NULL,
      label_cn TEXT NOT NULL,
      title_cn TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      content_cn TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS publishes (
      id INTEGER PRIMARY KEY,
      journal_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      label TEXT NOT NULL,
      label_cn TEXT NOT NULL,
      title_cn TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      content_cn TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_active INTEGER NOT NULL,
      is_superuser INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS static_assets (
      key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      mime_type TEXT,
      size_bytes INTEGER,
      updated_at TEXT NOT NULL
    );
  `);

  const now = "2026-06-06T00:00:00.000Z";

  db.exec(`
    INSERT OR IGNORE INTO static_assets VALUES
      ('brand.logoSvg', 'Primary SVG logo', '/logo.svg', 'image/svg+xml', NULL, '${now}'),
      ('brand.logoPng', 'PNG logo variant', '/logo.png', 'image/png', NULL, '${now}'),
      ('journal.fallbackCover', 'Fallback journal cover', '/cover.png', 'image/png', NULL, '${now}'),
      ('metadata.favicon', 'Favicon', '/favicon.ico', 'image/x-icon', NULL, '${now}');
  `);

  db.exec(`
    INSERT OR IGNORE INTO volumes (id, journal_id, volume_number, year, published, created_at, updated_at)
    SELECT
      volume_id,
      1,
      volume_number,
      COALESCE(CAST(strftime('%Y', publish_date) AS INTEGER), 2026),
      MAX(published),
      '${now}',
      '${now}'
    FROM issues
    GROUP BY volume_id, volume_number;
  `);

  const existingJournal = db.prepare("SELECT id FROM journals LIMIT 1").get();
  if (existingJournal) {
    return;
  }

  db.exec(`
    INSERT INTO journals VALUES (
      1,
      'Artificial Intelligence for Education',
      'Peer-reviewed open-access journal on AI in teaching, learning, assessment, and governance.',
      '',
      '<p>Artificial Intelligence for Education publishes research and practice on responsible AI-enabled education.</p>',
      '2999-0000',
      'Association of Global Intelligent Science and Technology',
      'Open Access',
      NULL,
      NULL,
      42,
      1280,
      '${now}',
      '${now}'
    );

    INSERT INTO issues VALUES
      (30, 6, 1, 1, 'Inaugural Issue', NULL, '2026-06-04', 1, 1, '${now}', '${now}'),
      (29, 5, 1, 2, 'AI Education Practice', NULL, '2025-12-15', 0, 1, '${now}', '${now}');

    INSERT INTO authors VALUES
      (44, 'Lili', NULL, 'Fan', 'Fan Lili', NULL, NULL, 'lili.fan@example.com', 'AI4E Lab', 'Researcher in AI education.', '${now}', '${now}'),
      (45, 'Sixiu', NULL, 'Liu', 'Liu Sixiu', NULL, NULL, 'sixiu.liu@example.com', 'Global Learning Institute', 'Works on lifelong learning systems.', '${now}', '${now}'),
      (46, 'Yiteng', NULL, 'Xu', 'Xu Yiteng', NULL, NULL, 'yiteng.xu@example.com', 'Future Education Center', 'Studies intelligent learning architecture.', '${now}', '${now}');

    INSERT INTO articles VALUES
      (
        95,
        'Teaching Reinforcement Learning in Large-Scale Interdisciplinary Classrooms: A Course Design and Practice',
        'regular',
        1,
        'This article presents a course design for teaching reinforcement learning in interdisciplinary classrooms.',
        '["Reinforcement Learning","Course Design","AI Education"]',
        '["Fan Lili"]',
        '[{"id":44,"first_name":"Lili","last_name":"Fan","display_name":"Fan Lili","is_corresponding":true}]',
        30,
        1,
        12,
        1,
        '2026-06-04',
        60,
        10,
        '2026-06-04T04:05:57.658174Z',
        '[]'
      ),
      (
        92,
        'K21 as a Finite Educational Backbone in the Age of AI: Toward an AI-Integrated Lifelong Learning Architecture',
        'regular',
        1,
        'This article describes an AI-integrated lifelong learning architecture.',
        '["Lifelong Learning","K21","Learning Architecture"]',
        '["Liu Sixiu","Xu Yiteng"]',
        '[{"id":45,"first_name":"Sixiu","last_name":"Liu","display_name":"Liu Sixiu","is_corresponding":true},{"id":46,"first_name":"Yiteng","last_name":"Xu","display_name":"Xu Yiteng","is_corresponding":false}]',
        30,
        13,
        28,
        2,
        '2026-06-04',
        72,
        2,
        '2026-06-04T04:05:57.658174Z',
        '[]'
      );

    INSERT INTO abouts VALUES
      (1, 1, 'About the Journal', 'About the Journal', '关于期刊', '关于期刊', 'journal', '<p>AI4E is an open-access journal for research at the intersection of artificial intelligence and education.</p>', '<p>AI4E 是关注人工智能与教育交叉研究的开放获取期刊。</p>', 1, '${now}', '${now}'),
      (2, 1, 'Editorial Board', 'Editorial Board', '编委会', '编委会', 'editorial-board', '<p>The editorial board brings together researchers and practitioners in AI and education.</p>', '<p>编委会汇集人工智能与教育领域的研究者和实践者。</p>', 2, '${now}', '${now}');

    INSERT INTO publishes VALUES
      (1, 1, 'Article Preparation', 'Article Preparation', '文章准备', '文章准备', 'article-preparation', '<p>Prepare manuscripts according to the journal format and ethical guidelines.</p>', '<p>请按照期刊格式和伦理规范准备稿件。</p>', 1, '${now}', '${now}'),
      (2, 1, 'Publishing Model', 'Publishing Model', '出版模式', '出版模式', 'publishing-model', '<p>AI4E publishes articles under an open-access model.</p>', '<p>AI4E 采用开放获取出版模式。</p>', 2, '${now}', '${now}');

    INSERT INTO users VALUES
      (1, 'admin', 'admin', 1, 1, '${now}', '${now}');
  `);

  db.exec(`
    INSERT OR IGNORE INTO volumes (id, journal_id, volume_number, year, published, created_at, updated_at)
    SELECT
      volume_id,
      1,
      volume_number,
      COALESCE(CAST(strftime('%Y', publish_date) AS INTEGER), 2026),
      MAX(published),
      '${now}',
      '${now}'
    FROM issues
    GROUP BY volume_id, volume_number;
  `);
}
