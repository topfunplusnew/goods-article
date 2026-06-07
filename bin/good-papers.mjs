#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(cliDirectory, "..");
const skillRelativePath = "skills/replicate-ai4e-site/SKILL.md";
const skillSourcePath = join(projectRoot, skillRelativePath);
const localSkillPath = join(projectRoot, ".codex/skills/replicate-ai4e-site/SKILL.md");

const rawArgs = process.argv.slice(2).filter((arg) => arg !== "--");

const command = rawArgs[0] ?? "help";
const args = new Set(rawArgs.slice(1));

function printHelp() {
  console.log(`Good Papers CLI

Usage:
  good-papers init [--skip-install] [--skip-db] [--skip-skill-install] [--force-env]
  good-papers skill [--print]
  good-papers dev
  good-papers help

Common scripts:
  pnpm init:project
  pnpm cli -- skill --print

Commands:
  init    Prepare local env files, data directories, project skill, dependencies, and SQLite seed data.
  skill   Show the project development SKILL location. Use --print to output the full SKILL.
  dev     Print the recommended AI-assisted development workflow for this project.
`);
}

function ensureDirectory(path) {
  mkdirSync(path, { recursive: true });
}

function logStep(message) {
  console.log(`[good-papers] ${message}`);
}

function run(commandName, commandArgs, options = {}) {
  logStep(`run ${commandName} ${commandArgs.join(" ")}`.trim());
  const result = spawnSync(commandName, commandArgs, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${commandName} exited with status ${result.status}`);
  }
}

function hasCommand(commandName) {
  const result = spawnSync(commandName, ["--version"], {
    cwd: projectRoot,
    stdio: "ignore",
    shell: false,
  });
  return result.status === 0;
}

function ensureEnvLocal() {
  const envExamplePath = join(projectRoot, ".env.example");
  const envLocalPath = join(projectRoot, ".env.local");

  if (!existsSync(envExamplePath)) {
    throw new Error(".env.example is missing.");
  }

  if (existsSync(envLocalPath) && !args.has("--force-env")) {
    logStep(".env.local already exists");
    return;
  }

  copyFileSync(envExamplePath, envLocalPath);
  logStep(`${args.has("--force-env") ? "rewrote" : "created"} .env.local`);
}

function ensureDataDirectories() {
  [
    "data",
    "data/uploads/issues",
    "data/uploads/journals",
    "data/uploads/static-assets",
  ].forEach((relativePath) => {
    ensureDirectory(join(projectRoot, relativePath));
  });
  logStep("ensured SQLite and upload directories");
}

function installProjectSkill() {
  if (args.has("--skip-skill-install")) {
    logStep("skipped project skill install");
    return;
  }

  if (!existsSync(skillSourcePath)) {
    throw new Error(`${skillRelativePath} is missing.`);
  }

  ensureDirectory(dirname(localSkillPath));
  copyFileSync(skillSourcePath, localSkillPath);
  logStep(`installed project skill to ${localSkillPath}`);
}

function installDependencies() {
  if (args.has("--skip-install")) {
    logStep("skipped dependency install");
    return;
  }

  if (!hasCommand("pnpm")) {
    throw new Error("pnpm is required for dependency installation. Install pnpm or rerun with --skip-install.");
  }

  run("pnpm", ["install"]);
}

function seedDatabase() {
  if (args.has("--skip-db")) {
    logStep("skipped SQLite initialization");
    return;
  }

  if (!hasCommand("pnpm")) {
    throw new Error("pnpm is required to run the database seed script. Install pnpm or rerun with --skip-db.");
  }

  run("pnpm", ["exec", "tsx", "scripts/seed-database.ts"]);
}

function printSkill({ full }) {
  if (!existsSync(skillSourcePath)) {
    throw new Error(`${skillRelativePath} is missing.`);
  }

  console.log(`Project development SKILL:
  source: ${skillSourcePath}
  local install target: ${localSkillPath}

Use this SKILL before AI-assisted implementation work that changes replica behavior, API contracts, static assets, or admin/public route parity.
`);

  if (full) {
    console.log(readFileSync(skillSourcePath, "utf8"));
  }
}

function printDevelopmentWorkflow() {
  console.log(`Good Papers AI development workflow

1. Initialize once:
   pnpm init:project

2. Ask the AI agent to use the project SKILL:
   Use ${skillRelativePath} before changing routes, API contracts, public/admin parity, or static asset behavior.

3. Develop locally:
   pnpm dev

4. Verify before claiming completion:
   pnpm run typecheck
   pnpm run lint
   pnpm test
   pnpm run build

5. Inspect the SKILL any time:
   pnpm cli -- skill --print
`);
}

function initProject() {
  ensureEnvLocal();
  ensureDataDirectories();
  installProjectSkill();
  installDependencies();
  seedDatabase();
  printDevelopmentWorkflow();
}

try {
  switch (command) {
    case "init":
      initProject();
      break;
    case "skill":
      printSkill({ full: args.has("--print") });
      break;
    case "dev":
      printDevelopmentWorkflow();
      break;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exitCode = 1;
  }
} catch (error) {
  console.error(`[good-papers] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
