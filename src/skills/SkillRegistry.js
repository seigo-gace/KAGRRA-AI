import { IntentReader } from "./documentation/IntentReader.js";
import { ContextAligner } from "./documentation/ContextAligner.js";
import { DocumentComposer } from "./documentation/DocumentComposer.js";
import { EvidenceSummarizer } from "./documentation/EvidenceSummarizer.js";
import { DeepResearchEngine } from "./research/DeepResearchEngine.js";
import { WorldModelEngine } from "./research/WorldModelEngine.js";
import { TechnicalDebtAnalyzer } from "./research/TechnicalDebtAnalyzer.js";
import { MythosParallelExplorer } from "./analysis/MythosParallelExplorer.js";
import { FailureGraphMapper } from "./analysis/FailureGraphMapper.js";
import { LogMiningEngine } from "./analysis/LogMiningEngine.js";
import { SecurityProbe } from "./security/SecurityProbe.js";
import { GitSnapshot } from "./execution/GitSnapshot.js";
import { PatchPlanner } from "./execution/PatchPlanner.js";
import { AtomicWriter } from "./execution/AtomicWriter.js";
import { RollbackEngineSkill } from "./recovery/RollbackEngineSkill.js";
import { V8StyleChecker } from "./v8/V8StyleChecker.js";

class StaticSkill {
  constructor(name, message) {
    this.name = name;
    this.message = message;
  }

  async run(input) {
    return { skill: this.name, ok: true, summary: this.message, data: { inputPreview: input.slice(0, 300) } };
  }
}

export class SkillRegistry {
  constructor() {
    this.skills = new Map();
    const list = [
      new IntentReader(),
      new ContextAligner(),
      new DocumentComposer(),
      new EvidenceSummarizer(),
      new DeepResearchEngine(),
      new WorldModelEngine(),
      new TechnicalDebtAnalyzer(),
      new MythosParallelExplorer(),
      new FailureGraphMapper(),
      new LogMiningEngine(),
      new SecurityProbe(),
      new GitSnapshot(),
      new PatchPlanner(),
      new AtomicWriter(),
      new RollbackEngineSkill(),
      new V8StyleChecker(),
      new StaticSkill("task_decomposer", "Task decomposition frame prepared."),
      new StaticSkill("output_normalizer", "Output normalization frame prepared."),
      new StaticSkill("future_simulator", "Future simulation frame prepared."),
      new StaticSkill("dependency_topologist", "Dependency topology frame prepared."),
      new StaticSkill("runtime_tracer", "Runtime tracing plan prepared."),
      new StaticSkill("regression_mapper", "Regression mapping plan prepared."),
      new StaticSkill("execution_logger", "Execution logging frame prepared.")
    ];

    for (const skill of list) this.skills.set(skill.name, skill);
  }

  async run(skillName, input, context) {
    const skill = this.skills.get(skillName);
    if (!skill) {
      return { skill: skillName, ok: false, summary: "Skill not found.", error: skillName };
    }
    return skill.run(input, context);
  }

  list() {
    return [...this.skills.keys()].sort();
  }
}
