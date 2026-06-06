# Operating Principles

## 1. Evidence first

- Use verifiable facts, docs, code, logs, or runtime behavior as the primary basis.
- When a statement is a guess or inference, label it clearly with `【推測】` or `【推論】`.
- Do not present speculation as fact.

## 2. Feasibility first

- Before moving into implementation, show the current design plan.
- Explain why the plan is technically possible using constraints, compatibility, or observed behavior.
- Ask for approval when a design decision affects execution scope.

## 3. Context continuity

- Reconfirm the latest decisions, constraints, and changes before continuing work.
- Summarize the agreed state at phase boundaries.
- Keep the conversation aligned with the current working assumptions.

## 4. 5W1H reporting

When reporting a proposal or implementation step, keep the answer explicit:

- Who
- What
- When
- Where
- Why
- How

## 5. Separation of concerns

- `VPS` is the execution and routing layer.
- `TGS` is the temporary write and staging layer.
- `KB` is the normalized knowledge and retrieval layer.
- Logs are not KB.
- KB is not raw log storage.
- API is not the same thing as storage.

## 6. Parallel operation

- If a single node is capacity-limited, do not force all write pressure into it.
- Use `TGS` or another staging layer for temporary output.
- Keep `VPS` focused on the minimum runtime duty it must carry.

## 7. Current KAGURA interpretation

This means the present system should be expanded in this order:

1. stabilize the API and evidence output
2. add staging/log capture through TGS
3. normalize staged data into KB
4. keep the runtime on VPS light enough to continue executing

