import { RouteDecision } from "../types.js";

export class Router {
  route(task: string): RouteDecision {
    const t = task.toLowerCase();

    if (/(architecture|future|scaling|debt|replace|refactor|research|search|cve|spec)/.test(t)) {
      return { persona: "OPUS", taskType: "architecture_or_research", reason: "Requires deep research, future modeling, or architecture judgment." };
    }

    if (/(crash|bug|error|failure|security|regression|trace|unknown|anomaly|segmentation|leak)/.test(t)) {
      return { persona: "MYTHOS", taskType: "failure_exploration", reason: "Requires 16-lane exploration, tracing, or failure mapping." };
    }

    if (/(patch|write|fix|commit|rollback|atomic|generate file|create file|write_file)/.test(t)) {
      return { persona: "HAIKU", taskType: "atomic_execution", reason: "Requires atomic coding or rollback-safe execution." };
    }

    return { persona: "SONNET", taskType: "intent_structuring", reason: "Default SONNET orchestration and documentation path." };
  }
}
