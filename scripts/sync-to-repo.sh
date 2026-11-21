#!/usr/bin/env bash
# 把本工作区的插件代码同步到发布仓库，并在通过测试后提交、推送。
#
# 用法：
#   ./scripts/sync-to-repo.sh -t /path/to/repo       # 同步 + 测试 + 提交 + 推送（必须指定目标仓库）
#   ./scripts/sync-to-repo.sh -m "修了什么"          # 指定提交说明
#   ./scripts/sync-to-repo.sh -f /tmp/msg.txt        # 从文件读提交说明
#   ./scripts/sync-to-repo.sh --no-test --no-push    # 只同步并提交，不测试/不推送
#   ./scripts/sync-to-repo.sh --dry-run              # 只显示会同步什么
#
# 退出码：0 成功（含「无变更」）；1 参数/环境错误；2 测试失败；3 提交或推送失败。

set -euo pipefail

# ── 默认值 ────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR=""
MESSAGE=""
MESSAGE_FILE=""
RUN_TESTS=1
DO_PUSH=1
DRY_RUN=0

# 需要同步的顶层条目（新增顶层文件时记得加到这里）
ITEMS=(lib scripts test docs data README.md package.json cordis.patch.yml LICENSE .gitignore)
# 永不覆盖/删除的东西
EXCLUDES=(.git node_modules .scratch .probe.txt)

usage() {
  sed -n '2,14p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

# ── 参数解析 ──────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    -t|--target)   TARGET_DIR="${2:?缺少目标目录}"; shift 2 ;;
    -m|--message)  MESSAGE="${2:?缺少提交说明}"; shift 2 ;;
    -f|--file)     MESSAGE_FILE="${2:?缺少说明文件}"; shift 2 ;;
    --no-test)     RUN_TESTS=0; shift ;;
    --no-push)     DO_PUSH=0; shift ;;
    --dry-run)     DRY_RUN=1; shift ;;
    -h|--help)     usage 0 ;;
    *) echo "未知参数：$1（用 --help 查看用法）" >&2; exit 1 ;;
  esac
done

say()  { printf '%s\n' "$*"; }
step() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }
die()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit "${2:-1}"; }

# ── 环境检查 ──────────────────────────────────────────────
step "检查环境"
[[ -f "$SOURCE_DIR/package.json" ]] || die "源目录不像插件仓库：$SOURCE_DIR"
[[ -n "$TARGET_DIR" ]] || die "请用 -t /path/to/repo 指定发布仓库（本脚本不默认写回任何目录）"
[[ -d "$TARGET_DIR/.git" ]] || die "目标目录不是 git 仓库：$TARGET_DIR
  可用 -t 指定，或先 git clone 到该路径。"
command -v rsync >/dev/null || die "需要 rsync"

cd "$TARGET_DIR"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
REMOTE="$(git remote | head -1 || true)"
say "源目录：$SOURCE_DIR"
say "目标仓库：$TARGET_DIR（分支 $BRANCH${REMOTE:+, 远程 $REMOTE}）"

if [[ -n "$(git status --porcelain)" ]]; then
  say "注意：目标仓库有未提交的改动，会一并纳入本次提交。"
fi

# ── 同步文件 ──────────────────────────────────────────────
step "同步文件"
RSYNC_ARGS=(-a --delete --itemize-changes)
for item in "${EXCLUDES[@]}"; do RSYNC_ARGS+=(--exclude "$item"); done

for item in "${ITEMS[@]}"; do
  [[ -e "$SOURCE_DIR/$item" ]] || { say "跳过不存在的 $item"; continue; }
  if [[ $DRY_RUN -eq 1 ]]; then
    rsync "${RSYNC_ARGS[@]}" --dry-run "$SOURCE_DIR/$item" "$TARGET_DIR/" | sed 's/^/  /'
  else
    rsync "${RSYNC_ARGS[@]}" "$SOURCE_DIR/$item" "$TARGET_DIR/" | sed 's/^/  /'
  fi
done

if [[ $DRY_RUN -eq 1 ]]; then
  step "试运行结束（未改动任何文件）"
  exit 0
fi

# ── 是否有变更 ────────────────────────────────────────────
step "检查变更"
git add -A
if git diff --cached --quiet; then
  say "没有需要提交的改动，已是最新。"
  exit 0
fi
git diff --cached --stat | tail -20

# ── 测试（在目标仓库里跑，确认复制后可用）─────────────────
if [[ $RUN_TESTS -eq 1 ]]; then
  step "在目标仓库运行测试"
  if ! node --test test/*.test.mjs >/tmp/dsh-zhongzhong-test.log 2>&1; then
    tail -30 /tmp/dsh-zhongzhong-test.log
    die "测试未通过，已中止提交（改动仍在工作区，可用 git reset 撤销暂存）" 2
  fi
  tail -5 /tmp/dsh-zhongzhong-test.log | sed 's/^/  /'
  if command -v node >/dev/null; then
    node scripts/check.mjs >/tmp/dsh-zhongzhong-check.log 2>&1 || {
      tail -10 /tmp/dsh-zhongzhong-check.log
      die "包结构检查未通过，已中止提交" 2
    }
    tail -1 /tmp/dsh-zhongzhong-check.log | sed 's/^/  /'
  fi
else
  say "已按 --no-test 跳过测试"
fi

# ── 提交 ──────────────────────────────────────────────────
step "提交"
if [[ -n "$MESSAGE_FILE" ]]; then
  [[ -f "$MESSAGE_FILE" ]] || die "找不到提交说明文件：$MESSAGE_FILE"
  MESSAGE="$(cat "$MESSAGE_FILE")"
fi
if [[ -z "$MESSAGE" ]]; then
  CHANGED="$(git diff --cached --numstat | wc -l | tr -d ' ')"
  MESSAGE="sync: 同步工作区到发布仓库（$CHANGED 个文件）

来源：$SOURCE_DIR
时间：$(date '+%Y-%m-%d %H:%M:%S')
测试：$([[ $RUN_TESTS -eq 1 ]] && echo 通过 || echo 跳过)"
fi

git commit -q -F - <<<"$MESSAGE" || die "提交失败" 3
COMMIT="$(git rev-parse --short HEAD)"
say "已提交 $COMMIT：$(git log -1 --pretty=%s)"

# ── 推送 ──────────────────────────────────────────────────
if [[ $DO_PUSH -eq 1 ]]; then
  if [[ -z "$REMOTE" ]]; then
    say "没有配置远程，跳过推送（提交已在本地）"
  else
    step "推送到 $REMOTE/$BRANCH"
    git push "$REMOTE" "$BRANCH" || die "推送失败（提交已在本地，可稍后手动 push）" 3
  fi
else
  say "已按 --no-push 跳过推送"
fi

step "完成"
say "提交：$COMMIT  分支：$BRANCH  目标：$TARGET_DIR"
[[ $DO_PUSH -eq 1 && -n "$REMOTE" ]] && say "远程：$(git remote get-url "$REMOTE")"
