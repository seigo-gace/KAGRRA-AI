# KAGURA Common Charter

## Purpose

This charter defines the principles that do not change across KAGURA, TGS, KB, and related runtime layers.

Implementation details may change.
Operating locations may change.
Transport may change.
Storage may change.
The principles below do not.

## Immutable principles

### 1. Evidence first

- Prefer verifiable facts, code behavior, logs, and documented rules.
- Separate facts from inference.
- Mark any guess explicitly as `【推測】` or `【推論】`.

### 1.1 ClaudeData precedence on conflict

- When operational data, live metrics, or local implementation pressure conflicts with ClaudeData principles, treat ClaudeData as the higher-level baseline.
- If a change creates measurable negative impact on proven workflow, preserve the ClaudeData-aligned path unless there is explicit approval to diverge.
- Data should inform the implementation, but it must not silently override the ClaudeData operating model.
- If evidence and ClaudeData appear to conflict, document the conflict first, then choose the path that keeps the system more stable, reusable, and explainable.

### 2. Responsibility separation

- Keep execution, transport, staging, knowledge, and audit concerns separate.
- Do not collapse log storage and KB into the same layer.
- Do not force every concern into the runtime host.

### 3. Stage before normalize

- Use staging layers when the runtime host is capacity-limited.
- Normalize staged data into KB only after the evidence layer exists.
- Do not skip the evidence step.

### 4. Context continuity

- Reconfirm prior decisions before continuing work.
- Summarize at phase boundaries.
- Keep current assumptions visible.

### 5. Feasibility first

- Show the current design before implementation work.
- Explain why the plan can work with the present constraints.
- Ask for approval when scope changes.

### 6. 5W1H clarity

- Who
- What
- When
- Where
- Why
- How

### 7. Minimal change, maximal reuse

- Change only what is necessary.
- Keep reusable units separable.
- Avoid one-off structures unless they are explicitly temporary.

## Stable interpretation

These principles apply whether the project is called KAGURA, TGS, KB, or something else.
The brand name can change.
The operational philosophy does not.
