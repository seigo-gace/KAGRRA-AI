#!/usr/bin/env bash
set -euo pipefail
if [ ! -f .env ]; then
  cp .env.example .env
fi
npm test
npm run audit
echo "KAGRRA v3 verified bootstrap complete."
