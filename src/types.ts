export type PersonaName = "SONNET" | "OPUS" | "MYTHOS" | "HAIKU";

export type ToolName =
  | "read_file"
  | "list_files"
  | "grep_search"
  | "git_snapshot"
  | "run_v8_build"
  | "run_v8_test"
  | "propose_patch"
  | "atomic_write"
  | "rollback"
  | "failure_graph"
  | "log_evidence";

export type ToolRequest = {
  tool: ToolName;
  reason: string;
  args: Record<string, unknown>;
  risk: number;
  requires_write: boolean;
};

export type KagrraResponse = {
  persona: PersonaName;
  summary: string;
  tool_requests: ToolRequest[];
  evidence: string[];
  risk_score: number;
  next_action: string;
};

export type RouteDecision = {
  persona: PersonaName;
  taskType: string;
  reason: string;
};

export type EvidenceEvent = {
  event_id: string;
  timestamp: string;
  persona: PersonaName;
  task: string;
  route_reason: string;
  summary: string;
  tool_requests: ToolRequest[];
  risk_score: number;
  next_action: string;
  cost_estimate_usd: number;
};

export type RuntimeContext = {
  workspaceRoot: string;
  v8Workspace: string;
  dryRun: boolean;
};
