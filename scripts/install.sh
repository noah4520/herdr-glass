#!/bin/sh
# Install the Herdr Glass layout into a Herdr home. Refuses to overwrite existing files
# unless --force is given; Herdr's own layouts and mods are never touched.
#   ./scripts/install.sh            stop if any of Herdr Glass's files is already there
#   ./scripts/install.sh --force    replace them (also resets Appearance choices)
# HERDR_APP_HOME picks another Herdr home (default ~/.config/herdr-app).
set -eu
HOME_DIR="${HERDR_APP_HOME:-$HOME/.config/herdr-app}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
MODS="herdr-glass-tabs herdr-glass-toast herdr-glass-chrome herdr-glass-agents herdr-glass-spaces herdr-glass-status herdr-glass-pane herdr-glass-bg"
FORCE="${1:-}"

case "$FORCE" in ""|--force) ;; *) echo "Usage: $0 [--force]" >&2; exit 2 ;; esac
[ -d "$HOME_DIR" ] || { echo "No Herdr home at $HOME_DIR. Open the Herdr app once first." >&2; exit 1; }
command -v rsync >/dev/null || { echo "rsync is needed to copy the mods." >&2; exit 1; }
if [ "$FORCE" != "--force" ]; then
  for f in layouts/herdr-glass.json themes/herdr-glass.json; do
    [ -e "$HOME_DIR/$f" ] && { echo "$HOME_DIR/$f exists. Re-run with --force to replace it." >&2; exit 1; }
  done
  for m in $MODS; do
    [ -e "$HOME_DIR/mods/$m" ] && { echo "$HOME_DIR/mods/$m exists. Re-run with --force to replace it." >&2; exit 1; }
  done
fi
mkdir -p "$HOME_DIR/layouts" "$HOME_DIR/themes" "$HOME_DIR/mods"
cp "$REPO/layouts/herdr-glass.json" "$REPO/layouts/herdr-glass.svg" "$HOME_DIR/layouts/"
cp "$REPO/themes/herdr-glass.json" "$HOME_DIR/themes/"
for m in $MODS; do
  rsync -a --delete "$REPO/mods/$m/" "$HOME_DIR/mods/$m/"
done
if command -v herdr-app >/dev/null; then
  # Quiet unless a mod fails: Herdr's own spaces code warns that it calls hc when checked.
  for m in $MODS; do
    out=$(herdr-app check "$HOME_DIR/mods/$m" 2>&1) || { echo "check failed: $m" >&2; echo "$out" >&2; }
  done
  echo "Installed Herdr Glass $(cat "$REPO/VERSION" 2>/dev/null). Switch to it with: herdr-app do layout.switch '{\"name\":\"herdr-glass\"}'"
else
  echo "Installed Herdr Glass $(cat "$REPO/VERSION" 2>/dev/null). herdr-app isn't on PATH, so the mods weren't checked;"
  echo "pick Herdr Glass in Herdr's Settings › Layout."
fi
