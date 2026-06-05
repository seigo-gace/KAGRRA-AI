export class Router {
  route(task) {
    const t = task.toLowerCase();

    if (/(architecture|future|scaling|debt|replace|refactor|research|search|cve|spec)/.test(t)) {
      return {
        persona: "OPUS",
        taskType: "architecture_or_research",
        reason: "Requires deep research, future modeling, or architecture judgment.",
        skills: ["deep_research_engine", "world_model_engine", "technical_debt_analyzer", "dependency_topologist"]
      };
    }

    if (/(crash|bug|error|failure|security|regression|trace|unknown|anomaly|segmentation|leak)/.test(t)) {
      return {
        persona: "MYTHOS",
        taskType: "failure_exploration",
        reason: "Requires 16-lane exploration, tracing, or failure mapping.",
        skills: ["mythos_parallel_explorer", "log_mining_engine", "failure_graph_mapper", "security_probe", "regression_mapper"]
      };
    }

    if (/(patch|write|fix|commit|rollback|atomic|generate file|create file|write_file)/.test(t)) {
      return {
        persona: "HAIKU",
        taskType: "atomic_execution",
        reason: "Requires atomic coding or rollback-safe execution.",
        skills: ["git_snapshot", "patch_planner", "atomic_writer", "rollback_engine", "v8_style_checker", "execution_logger"]
      };
    }

    return {
      persona: "SONNET",
      taskType: "intent_structuring",
      reason: "Default SONNET orchestration and documentation path.",
      skills: ["intent_reader", "context_aligner", "task_decomposer", "document_composer", "evidence_summarizer", "output_normalizer"]
    };
  }
}
