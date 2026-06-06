# Transport and Storage

## Current model

```text
VPS
├─ runtime
├─ routing
├─ execution
└─ lightweight evidence emit

TGS
├─ temporary writes
├─ log capture
├─ evidence staging
└─ intermediate outputs

KB
├─ decisions
├─ architecture notes
├─ risks
└─ reusable knowledge
```

## Rules

- Do not store everything on VPS if capacity is limited.
- Do not treat TGS as the final KB.
- Do not skip the evidence step between runtime and KB.
- Do not mix operational transport with knowledge normalization.

## Intended flow

```text
Runtime / Agents
  -> VPS execution
  -> TGS staging
  -> KB normalization
```

## Notes

- Telegram log server belongs in transport/staging, not in the KB core.
- KB should be built from normalized outputs, not raw noisy streams.
- Evidence is the bridge between execution and knowledge.

