#!/usr/bin/env bash
set -euo pipefail
export KAGRRA_DRY_RUN=true
node src/cli.js run "$*"
