import { GeminiClient } from "../api/GeminiClient.js";
import { PromptBuilder } from "../adapter/PromptBuilder.js";
import { ResponseParser } from "../adapter/ResponseParser.js";
import { Router } from "./Router.js";
import { SecurityPolicy } from "../security/SecurityPolicy.js";
import { EvidenceLedger } from "../evidence/EvidenceLedger.js";
import { ToolRuntime } from "../tools/ToolRuntime.js";
import { StateMachine } from "../state/StateMachine.js";
import { V8Adapter } from "../v8/V8Adapter.js";
import { SkillRegistry } from "../skills/SkillRegistry.js";

export class KagrraRuntime {
  constructor(context, apiKey) {
    this.context = context;
    this.apiKey = apiKey;
    this.router = new Router();
    this.builder = new PromptBuilder(context.workspaceRoot);
    this.parser = new ResponseParser();
    this.security = new SecurityPolicy();
    this.ledger = new EvidenceLedger(context.workspaceRoot);
    this.tools = new ToolRuntime();
    this.state = new StateMachine();
    this.skills = new SkillRegistry();
  }

  modelFor(persona) {
    if (persona === "OPUS") return process.env.KAGRRA_MODEL_OPUS || "gemini-2.5-pro";
    if (persona === "MYTHOS") return process.env.KAGRRA_MODEL_MYTHOS || "gemini-2.5-flash";
    if (persona === "HAIKU") return process.env.KAGRRA_MODEL_HAIKU || "gemini-2.5-flash-lite";
    return process.env.KAGRRA_MODEL_SONNET || "gemini-2.5-flash";
  }

  async doctor() {
    const v8 = await new V8Adapter(this.context.v8Workspace).doctor();
    return {
      runtime: "KAGRRA_COMPLETE_DEV_PACKAGE_v3_VERIFIED",
      state: this.state.current(),
      timeline: this.state.timeline(),
      dryRun: this.context.dryRun,
      apiKeyPresent: Boolean(this.apiKey),
      workspaceRoot: this.context.workspaceRoot,
      v8Workspace: this.context.v8Workspace,
      skills: this.skills.list(),
      v8
    };
  }

  route(task) {
    return this.router.route(task);
  }

  async run(task) {
    this.state.transition("ROUTING");
    const route = this.router.route(task);

    this.state.transition("RUNNING_SKILLS");
    const skillResults = [];
    for (const skill of route.skills) skillResults.push(await this.skills.run(skill, task, this.context));

    this.state.transition("CALLING_MODEL");
    const prompt = this.builder.build(route.persona, task, skillResults);
    const model = this.modelFor(route.persona);

    const raw = await new GeminiClient(this.apiKey, this.context.dryRun).generate(model, prompt, route.persona);
    const parsed = this.parser.parse(raw, route.persona);

    this.state.transition("VALIDATING_TOOLS");
    const validation = this.security.validateToolRequests(route.persona, parsed.tool_requests);

    const toolResults = [];
    if (validation.ok) {
      this.state.transition("EXECUTING_TOOLS");
      for (const request of parsed.tool_requests) toolResults.push(await this.tools.execute(request, this.context));
    }

    this.state.transition("WRITING_EVIDENCE");
    await this.ledger.append({
      persona: route.persona,
      task,
      route_reason: route.reason,
      skills_used: route.skills,
      skill_results: skillResults,
      summary: parsed.summary,
      tool_requests: parsed.tool_requests,
      risk_score: validation.ok ? parsed.risk_score : 95,
      next_action: validation.ok ? parsed.next_action : `Security blocked: ${validation.errors.join("; ")}`
    });

    this.state.transition(validation.ok ? "DONE" : "FAILED");

    return {
      route,
      model,
      skill_results: skillResults,
      response: parsed,
      tool_validation: validation,
      tool_results: toolResults,
      state: this.state.current(),
      timeline: this.state.timeline()
    };
  }

  async evidence() {
    return this.ledger.tail();
  }
}
