# Deployment Checklist

This checklist is for the final pass before push or deployment.

## 1. Principle check

- `DEVELOPMENT_GUIDELINE_AND_RULEBOOK.md` has been read.
- `docs/operations/kagrra-charter.md` has been read.
- If runtime pressure conflicts with ClaudeData compatibility, ClaudeData takes priority unless an explicit divergence decision has been approved.
- Facts and inferences are kept separate.

## 2. Root package check

- `README.md` matches the current structure.
- `README_FIRST.txt` matches the intended reading order.
- `docs/roadmap/` exists and reflects the current phase plan.
- `docs/operations/` exists and defines the common operating rules.
- `PROJECT_TREE.txt` matches the real folder layout.
- `src/cli.js` and `src/dashboard/server.js` do not depend on unnecessary external packages.

## 3. API server check

- `KAGURA_API_SERVER/README.md` matches the root charter and roadmap.
- `KAGURA_API_SERVER/DEPLOYMENT.md` matches the current deployment flow.
- `KAGURA_API_SERVER/FILE_TREE.md` matches the actual API server structure.
- `/health`, `/v1/manifest`, `/v1/kagura/evidence`, `/v1/kagura/route`, `/v1/kagura/run`, `/v1/kagura/research`, and `/v1/kagura/compress` are documented consistently.
- Telegram log server and KB are treated as separate concerns from the core API contract.

## 4. Runtime check

- Environment variables are defined in `.env.example`.
- Evidence paths are writable.
- V8 workspace references are valid.
- Dry-run / fallback mode is documented.
- No obvious path escape or storage boundary violation remains unaddressed.

## 5. Quality check

- Test commands are known.
- Audit commands are known.
- Any failed verification step is recorded.
- Unresolved decisions are documented before push.

## 6. Push gate

Proceed to push only if all of the following are true:

- The current design is still aligned with the charter.
- The API server and root docs point to the same operating model.
- Any remaining issue is explicit, bounded, and accepted.
- The change set is ready to be reviewed by another person or agent.

