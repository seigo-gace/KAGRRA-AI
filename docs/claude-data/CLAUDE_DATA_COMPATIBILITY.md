# ClaudeData Compatibility Notes

This document preserves the operational ideas that KAGRRA borrows from Claude Code-like behavior.

KAGRRA does not copy Claude. It recreates the runtime discipline:

- project awareness
- tool loop
- evidence-first execution
- reversible mutation
- task decomposition
- codebase reading before editing
- execution feedback
- patch verification
- safe rollback
- final human-readable report

## Claude-like Runtime Contract

1. Read before write.
2. Explain route before action.
3. Use tools through explicit contracts.
4. Never mutate without rollback.
5. Treat shell, git, patch, build, and test as controlled tools.
6. Preserve evidence for each step.
7. Return to an orchestrator after specialized work.
8. Keep execution scoped and auditable.

## KAGRRA Mapping

- Claude-like project context → SONNET context alignment
- Claude-like deep reasoning → OPUS future architecture
- Claude-like debugging loop → MYTHOS 16-lane exploration
- Claude-like edit/apply/check → HAIKU atomic execution
- Claude-like tool use → ToolRuntime
- Claude-like transcript → EvidenceLedger
