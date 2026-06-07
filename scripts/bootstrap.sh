#!/usr/bin/env sh
set -eu

PROJECT_NAME="good-papers"
DEFAULT_REPO_URL="https://github.com/topfunplusnew/goods-article"
REPO_URL="${1:-${GOOD_PAPERS_REPO:-}}"
TARGET_DIR="${2:-${GOOD_PAPERS_DIR:-}}"
INIT_ARGS="${GOOD_PAPERS_INIT_ARGS:-}"

usage() {
  cat <<'EOF'
Good Papers bootstrap

Usage:
  sh scripts/bootstrap.sh
  sh bootstrap.sh <repo-url> [target-dir]
  GOOD_PAPERS_REPO=<repo-url> sh bootstrap.sh

Behavior:
  - If the current directory is already the good-papers project, initialize it.
  - Otherwise ask for a repo URL when one was not provided.
  - Press Enter at the prompt to use https://github.com/topfunplusnew/goods-article.
  - Clone the repo into [target-dir], or the repository name when [target-dir] is omitted.
  - Initialize through the project CLI, or a compatibility path when the CLI is missing.
  - Initialization delegates to: pnpm run init:project when available.
  - Optional init flags can be passed with GOOD_PAPERS_INIT_ARGS.
EOF
}

log() {
  printf '[good-papers-bootstrap] %s\n' "$1"
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

has_init_arg() {
  case " $INIT_ARGS " in
    *" $1 "*) return 0 ;;
    *) return 1 ;;
  esac
}

derive_target_dir() {
  repo_name="${REPO_URL##*/}"
  repo_name="${repo_name%.git}"

  if [ -n "$repo_name" ]; then
    TARGET_DIR="$repo_name"
  else
    TARGET_DIR="$PROJECT_NAME"
  fi
}

prompt_for_repo_url() {
  if [ -n "$REPO_URL" ]; then
    return
  fi

  if [ -r /dev/tty ]; then
    printf 'Enter Good Papers repository URL [%s]: ' "$DEFAULT_REPO_URL" >/dev/tty
    IFS= read -r REPO_URL </dev/tty
  else
    printf 'Enter Good Papers repository URL [%s]: ' "$DEFAULT_REPO_URL"
    IFS= read -r REPO_URL
  fi

  if [ -z "$REPO_URL" ]; then
    REPO_URL="$DEFAULT_REPO_URL"
  fi
}

ensure_pnpm() {
  if has_command pnpm; then
    return
  fi

  if has_command corepack; then
    log "pnpm not found; enabling it through corepack"
    corepack enable
    corepack prepare pnpm@latest --activate
    return
  fi

  log "pnpm is required. Install pnpm or install Node.js with corepack, then rerun this script."
  exit 1
}

is_project_root() {
  test -f package.json && node -e "const pkg=require('./package.json'); process.exit(pkg.name === 'good-papers' ? 0 : 1)" >/dev/null 2>&1
}

clone_project() {
  prompt_for_repo_url

  if [ -z "$TARGET_DIR" ]; then
    derive_target_dir
  fi

  if ! has_command git; then
    log "git is required to clone the project."
    exit 1
  fi

  if [ -e "$TARGET_DIR" ]; then
    if [ -f "$TARGET_DIR/package.json" ]; then
      log "target exists; using $TARGET_DIR"
    else
      log "target exists but is not a good-papers project: $TARGET_DIR"
      exit 1
    fi
  else
    log "cloning $REPO_URL into $TARGET_DIR"
    git clone "$REPO_URL" "$TARGET_DIR"
  fi

  cd "$TARGET_DIR"
}

run_project_init() {
  if node -e "const pkg=require('./package.json'); process.exit(pkg.scripts && pkg.scripts['init:project'] ? 0 : 1)" >/dev/null 2>&1; then
    if [ -n "$INIT_ARGS" ]; then
      log "running pnpm run init:project -- $INIT_ARGS"
      # shellcheck disable=SC2086
      pnpm run init:project -- $INIT_ARGS
    else
      log "running pnpm run init:project"
      pnpm run init:project
    fi
    return
  fi

  if [ -f bin/good-papers.mjs ]; then
    if [ -n "$INIT_ARGS" ]; then
      log "running node bin/good-papers.mjs init $INIT_ARGS"
      # shellcheck disable=SC2086
      node bin/good-papers.mjs init $INIT_ARGS
    else
      log "running node bin/good-papers.mjs init"
      node bin/good-papers.mjs init
    fi
    return
  fi

  log "project CLI not found; running compatibility initialization"

  if [ -f .env.example ] && [ ! -f .env.local ]; then
    cp .env.example .env.local
    log "created .env.local"
  elif [ -f .env.local ]; then
    log ".env.local already exists"
  else
    log ".env.example missing; skipped env initialization"
  fi

  mkdir -p data data/uploads/issues data/uploads/journals data/uploads/static-assets
  log "ensured SQLite and upload directories"

  if [ -f skills/replicate-ai4e-site/SKILL.md ] && ! has_init_arg "--skip-skill-install"; then
    mkdir -p .codex/skills/replicate-ai4e-site
    cp skills/replicate-ai4e-site/SKILL.md .codex/skills/replicate-ai4e-site/SKILL.md
    log "installed project skill into .codex/skills"
  fi

  if ! has_init_arg "--skip-install"; then
    log "running pnpm install"
    pnpm install
  else
    log "skipped dependency install"
  fi

  if [ -f scripts/seed-database.ts ] && ! has_init_arg "--skip-db"; then
    log "running pnpm exec tsx scripts/seed-database.ts"
    pnpm exec tsx scripts/seed-database.ts
  else
    log "skipped SQLite initialization"
  fi
}

main() {
  if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
    usage
    exit 0
  fi

  if is_project_root; then
    log "using current project directory"
  else
    clone_project
  fi

  ensure_pnpm
  run_project_init
}

main "$@"
