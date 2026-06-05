# KAGRRA Runtime Architecture

Gemini API
→ Prompt Builder
→ Persona Runtime
→ Router
→ Skill Registry
→ Tool Runtime
→ Security Policy
→ Evidence Ledger
→ V8 Workspace

## Core Principle

The model does not own execution.
The runtime owns execution.

## Mutation Control

Only HAIKU may request write tools.
The ToolRuntime enforces workspace boundaries.
The EvidenceLedger records the result.
