#!/usr/bin/env bash
# Разовая подготовка скриншотов без sudo: Playwright, Chromium и системные библиотеки (libnss3, libnspr4, libasound)
# кладутся в $PW_DIR (по умолчанию ~/.cache/ai-pro-school-shots), проект не трогаем. shots.mjs подхватит их сам.
set -euo pipefail
PW_DIR="${PW_DIR:-$HOME/.cache/ai-pro-school-shots}"
mkdir -p "$PW_DIR/debs" "$PW_DIR/libs" && cd "$PW_DIR"

[ -d node_modules/playwright ] || { npm init -y >/dev/null; npm i playwright; }
ls "$HOME"/.cache/ms-playwright/chromium-* >/dev/null 2>&1 || npx playwright install chromium

CHROME=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux/chrome | tail -1)
export LD_LIBRARY_PATH="$PW_DIR/libs/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH:-}"
if ldd "$CHROME" | grep -q "not found"; then
  # apt без root: свой каталог списков и кэша (иначе список пакетов может быть устаревшим и скачивание даст 404)
  mkdir -p apt/lists/partial apt/cache/archives/partial
  O="-o Dir::State::Lists=$PW_DIR/apt/lists -o Dir::Cache=$PW_DIR/apt/cache -o Debug::NoLocking=1"
  apt-get $O update >/dev/null
  (cd debs && apt-get $O download libnss3 libnspr4 libasound2t64 2>/dev/null || apt-get $O download libnss3 libnspr4 libasound2)
  for d in debs/*.deb; do dpkg -x "$d" libs; done
fi
ldd "$CHROME" | grep "not found" && { echo "Остались ненайденные библиотеки"; exit 1; }
echo "Готово. Playwright: $PW_DIR"
