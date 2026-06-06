# KAGURA / KAGRRA AI

KAGURA は、Gemini Flash を身体として使いながら、ClaudeData・Skill Script・V8 Workspace・Token Compression を段階的に統合していく知能基盤プロジェクトです。

このリポジトリは「完成品を一気に作る」ためではなく、現状の最小実装から未来の拡張に耐えられるように、構造と責務を先に固定するための土台です。

## まず読むもの

1. `DEVELOPMENT_GUIDELINE_AND_RULEBOOK.md`
2. `docs/operations/kagrra-charter.md`
3. `README_FIRST.txt`
4. この README
5. `docs/architecture/RUNTIME_ARCHITECTURE.md`
6. `docs/claude-data/CLAUDE_DATA_COMPATIBILITY.md`
7. `docs/operations/README.md`
8. `docs/roadmap/README.md`
9. `docs/operations/deployment-checklist.md`

この順番で読むと、開発思想・現在地・将来像がぶれにくくなります。

## いまの結論

- 現在は `KAGURA Lite` の段階です。
- まずは最小 API / 最小 runtime / 最小 evidence の形で進めます。
- `LivralCore` は未完成なので、現時点では「core の main を最小核として育てる」方針が適切です。
- ただし、今の `main` は将来の巨大コアを先取りしすぎず、差し替え可能な境界を保つべきです。
- つまり、実装は小さく、設計は未来拡張に開いておくのが正解です。

## プロジェクトの役割

KAGURA は、次の要素を統合するための基盤です。

- ClaudeData 的な開発思想
- Skill Script 的な実行単位
- V8 Workspace との接続
- Knowledge / Memory / Evidence の蓄積
- 将来の AI 協調運用

## 優先順位

実装や運用がデータ上でぶつかるときは、まず ClaudeData compatibility を優先します。

- 実績データは重要
- ただし、ClaudeData を壊す変更は既定では採用しない
- 変更が必要なら、影響を明示してから進める

## 現在の開発方針

このリポジトリでは、最初から大規模な完成系を作りません。

優先順位は次の通りです。

1. 最小単位へ分解する
2. 単一責務に保つ
3. 再利用できる形で置く
4. 現在の実装を壊さずに未来拡張できるようにする
5. 仕様が未確定なものを勝手に増やさない

## 現在地

### フェーズ位置

```text
PHASE 0  構想・検証
PHASE 1  KAGURA Lite
PHASE 2  Knowledge 蓄積
PHASE 3  KAGURA API
PHASE 4  V8 Workspace
PHASE 5  AIP
PHASE 6  Runtime Foundation
PHASE 7  KAGURA Core
```

今は `PHASE 1` を中心に、`PHASE 2` と `PHASE 3` に進めるための土台を整えている段階です。

## 現在の構成

```text
KAGRRA-AI
├─ .github/
├─ .kagrra/
├─ config/
├─ docs/
│  ├─ architecture/
│  └─ claude-data/
├─ prompts/
├─ sandbox/
├─ scripts/
├─ src/
│  ├─ adapter/
│  ├─ api/
│  ├─ core/
│  ├─ dashboard/
│  ├─ evidence/
│  ├─ parallel/
│  ├─ recovery/
│  ├─ security/
│  ├─ state/
│  ├─ tools/
│  ├─ utils/
│  ├─ v8/
│  └─ workspace/
├─ tests/
├─ v8/
└─ workspaces/
   └─ v8/
```

### いまの意味づけ

- `src/core/` は runtime の中核
- `src/api/` は外部 API 接続
- `src/tools/` は制御された実行層
- `src/evidence/` は証跡記録
- `src/security/` は実行制約
- `src/workspace/` は shadow workspace
- `src/v8/` は V8 連携の入口
- `workspaces/v8/` は実際の V8 実体を置く場所
- `KAGURA_API_SERVER/` は将来の API 拡張用に切り出された別レイヤー

## 将来の拡張方針

将来は、次のような責務分離に寄せていきます。

```text
src/
├─ kernel/
├─ memory/
├─ knowledge/
├─ skills/
├─ tools/
├─ runtime/
├─ orchestrator/
├─ security/
├─ evidence/
├─ dashboard/
├─ adapters/
└─ v8/
```

### 追加予定の概念

- `RuntimeKernel`
- `Memory Layer`
- `Knowledge Base`
- `ClaudeData 移植領域`
- `Skill Runtime`
- `Tool Runtime`
- `Gemini Runtime`
- `Orchestrator`
- `Security Layer`
- `Evidence System`
- `Dashboard`

## ロードマップ

### Phase 0: 構想固定

目的:

- ClaudeData
- Skill Script
- V8 Workspace

を理解し、KAGURA の思想と方針を固定する。

### Phase 1: KAGURA Lite

目的:

- Gemini Flash を使う
- ClaudeData / Skill Script / V8 Workspace を組み込む

中心要素:

- System Prompt
- ClaudeData
- Skill Script
- Token Compression
- Workspace
- Raphael Interface

### Phase 2: Knowledge 蓄積

目的:

- 会話を資産化する

対象:

- Logs
- Knowledge
- Decisions
- Architecture
- Constraints
- Risks

### Phase 3: KAGURA API

目的:

- Prompt 依存を減らす

API の核:

- `/health`
- `/manifest`
- `/evidence`
- `/chat`
- `/memory`
- `/knowledge`
- `/compression`
- `/handoff`

### Phase 4: V8 Workspace

目的:

- AI 運用基盤を構築する

### Phase 5: AIP

目的:

- AI の役割分担とルーティングを持つ

### Phase 6: Runtime Foundation

目的:

- Prompt から脱却する

### Phase 7: KAGURA Core

目的:

- KAGURA API
- V8 Workspace
- AIP
- Runtime
- Knowledge
- Memory
- Compression

を統合する。

## 将来の最終像

```text
Master
└─ KAGURA Core
   ├─ AIP
   │  ├─ SONNET
   │  ├─ OPUS
   │  ├─ MYTHOS
   │  ├─ HAIKU
   │  └─ HOMURA
   ├─ Runtime
   ├─ Knowledge Base
   ├─ Memory Layer
   ├─ Compression
   ├─ Handoff
   └─ V8 Workspace
```

## KAGURA の一文定義

```yaml
mission: >
  Gemini Flash を身体として利用し、
  ClaudeData・Skill Script・V8 Workspace・Token Compression を統合し、
  長期開発・知識継承・AI 協調運用を実現する
  知能基盤を構築する。
```

## セットアップ

```bash
cp .env.example .env
npm test
npm run audit
```

Node.js 20 以上を想定しています。
このリポジトリの root runtime は Node.js 標準モジュール中心なので、追加の npm install を前提にしません。

## 開発時コマンド

```bash
npm run doctor
npm run route -- "unknown V8 crash"
npm run run -- "Analyze V8 build failure"
npm run dashboard
```

## V8 Workspace

V8 本体は次の場所を想定しています。

```text
workspaces/v8
```

このディレクトリがまだ空でも、runtime は dry-run で起動できます。

## KAGURA_API_SERVER について

`KAGURA_API_SERVER/` は、将来の KAGURA API 拡張を見据えた別レイヤーです。

現時点では「最小 API を先に育て、後から core と接続する」方針で扱うのが安全です。

## 補足

このリポジトリの開発判断は、`DEVELOPMENT_GUIDELINE_AND_RULEBOOK.md` の方針に従います。

特に次を守ります。

- いきなり大きく作らない
- 責務を混ぜない
- 未確定事項を勝手に埋めない
- 現在地と将来像を分けて書く

