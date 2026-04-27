#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TASKS_DIR="$(cd "$SCRIPT_DIR/../tasks" && pwd)"
BOARD="$TASKS_DIR/BOARD.md"

# When invoked as a PostToolUse hook, stdin contains tool JSON.
# Skip regeneration unless the touched file is a task file (not BOARD/README).
# When invoked manually (TTY stdin or empty stdin), always regenerate.
if [ ! -t 0 ]; then
  payload="$(cat || true)"
  if [ -n "$payload" ]; then
    fpath="$(printf '%s' "$payload" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"
    if [ -n "$fpath" ]; then
      case "$fpath" in
        */.claude/tasks/BOARD.md|*/.claude/tasks/README.md) exit 0 ;;
        */.claude/tasks/*.md) ;;
        *) exit 0 ;;
      esac
    fi
  fi
fi

rows_open=""
rows_in_progress=""
rows_blocked=""
rows_done=""

shopt -s nullglob
for f in "$TASKS_DIR"/*.md; do
  base="$(basename "$f")"
  case "$base" in
    README.md|BOARD.md) continue ;;
  esac

  id=""
  status=""
  priority=""
  type=""
  attempts=""

  while IFS= read -r line; do
    case "$line" in
      "id:"*)       id="${line#id:}";       id="${id# }" ;;
      "status:"*)   status="${line#status:}";   status="${status# }" ;;
      "priority:"*) priority="${line#priority:}"; priority="${priority# }" ;;
      "type:"*)     type="${line#type:}";     type="${type# }" ;;
      "attempts:"*) attempts="${line#attempts:}"; attempts="${attempts# }" ;;
    esac
  done < <(awk '/^---[[:space:]]*$/{c++; next} c==1' "$f")

  title="$(awk '/^# /{sub(/^# /,""); print; exit}' "$f")"

  status="${status:-open}"
  priority="${priority:-9}"
  attempts="${attempts:-0}"
  type="${type:--}"
  id="${id:-${base%.md}}"
  title="${title:-(без заголовка)}"

  row="${priority}|${id}|${type}|${attempts}|${title}|${base}"$'\n'

  case "$status" in
    open)        rows_open+="$row" ;;
    in_progress) rows_in_progress+="$row" ;;
    blocked)     rows_blocked+="$row" ;;
    done)        rows_done+="$row" ;;
    *)           rows_open+="$row" ;;
  esac
done

print_section() {
  local header="$1" rows="$2"
  local count=0
  if [ -n "$rows" ]; then
    count=$(printf "%s" "$rows" | grep -c '^' || true)
  fi

  printf "## %s (%s)\n\n" "$header" "$count"

  if [ -z "$rows" ]; then
    printf "_Пусто._\n\n"
    return
  fi

  printf "| Pri | ID | Type | Att | Title |\n"
  printf "|-----|----|------|-----|-------|\n"
  printf "%s" "$rows" | sort -n | while IFS='|' read -r pri tid ttype tatt ttitle tbase; do
    [ -z "$tid" ] && continue
    printf "| %s | [\`%s\`](%s) | %s | %s | %s |\n" "$pri" "$tid" "$tbase" "$ttype" "$tatt" "$ttitle"
  done
  printf "\n"
}

{
  printf "# Доска задач\n\n"
  printf "_Автогенерация из \`.claude/tasks/*.md\`. Не редактируй вручную — перезатрётся хуком при следующем write/edit задачи._\n\n"

  print_section "Open"        "$rows_open"
  print_section "In Progress" "$rows_in_progress"
  print_section "Blocked"     "$rows_blocked"
  print_section "Done"        "$rows_done"

  printf -- "---\n"
  printf "_Обновлено: %s_\n" "$(date '+%Y-%m-%d %H:%M:%S')"
} > "$BOARD"
