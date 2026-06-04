#!/usr/bin/env bash
set -euo pipefail
export KAGRRA_DRY_RUN=true
npm run dev -- run "$*"
