#!/usr/bin/env bash
# Production-копия проекта на отдельном порту для скриншотов — .next и dev-сервер основного проекта не затрагиваются.
#   bash scripts/shots-serve.sh [порт=3111]      # собрать копию и запустить
#   kill "$(cat /tmp/aps-shots.pid)"             # остановить
set -euo pipefail
PORT="${1:-3111}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COPY=/tmp/aps-shots-site
[ -f /tmp/aps-shots.pid ] && kill "$(cat /tmp/aps-shots.pid)" 2>/dev/null || true
rm -rf "$COPY" && mkdir -p "$COPY"
(cd "$ROOT" && tar --exclude=node_modules --exclude=.next --exclude=.git --exclude=tmp -cf - .) | tar -xf - -C "$COPY"
ln -s "$ROOT/node_modules" "$COPY/node_modules"
cd "$COPY" && npm run build >/tmp/aps-shots-build.log 2>&1 || { tail -30 /tmp/aps-shots-build.log; exit 1; }
nohup node node_modules/next/dist/bin/next start -p "$PORT" >/tmp/aps-shots-server.log 2>&1 &
echo $! >/tmp/aps-shots.pid
sleep 4
echo "Сайт (копия) на http://localhost:$PORT, PID $(cat /tmp/aps-shots.pid), логи /tmp/aps-shots-server.log"
