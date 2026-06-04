#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
fi

npm install
npm run build
npm test

echo "KAGRRA bootstrap complete."
