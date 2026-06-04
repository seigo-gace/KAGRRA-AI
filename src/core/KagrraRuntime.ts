import path from "node:path";
import { GeminiClient } from "../api/GeminiClient.js";
import { PromptBuilder } from "../adapter/PromptBuilder.js";
import { ResponseParser } from "../adapter/ResponseParser.js";
import { Router } from "./Router.js";
import { SecurityPolicy } from "../security/SecurityPolicy.js";
import { EvidenceLedger } from "../evidence/EvidenceLedger.js";
import { ToolRuntime } from "../tools/ToolRuntime.js";
import { StateMachine } from "../state/StateMachine.js";
import { RuntimeContext } from "../types.js";
import { V8Adapter } from "../v8/V8Adapter.js";

export class KagrraRuntime {
  private router = new Router();
  private builder = new PromptBuilder();
  private parser = new ResponseParser();
  private security = new SecurityPolicy();
  private ledger: EvidenceLedger;
  private tools = new ToolRuntime();
  private state = new StateMachine();

  constructor(private readonly context: RuntimeContext, private readonly apiKey?: string) {
    this.ledger = new EvidenceLedger(context.workspaceRoot);
  }

  modelFor(persona: string): string {
    if (persona === "OPUS") return process.env.KAGRRA_MODEL_OPUS || "gemini-2.5-pro";
    if (persona === "MYTHOS") return process.env.KAGRRA_MODEL_MYTHOS || "gemini-2.5-flash";
    if (persona === "HAIKU") return process.env.KAGRRA_MODEL_HAIKU || "gemini-2.5-flash-lite";
    return process.env.KAGRRA_MODEL_SONNET || "gemini-2.5-flash";
  }

  async doctor(): Promise<unknown> {
    const v8 = await new V8Adapter(this.context.v8Workspace).doctor();

    return {
      runtime: "KAGRRA_COMPLETE_DEV_PACKAGE_v1",
      state: this.state.current(),
      dryRun: this.context.dryRun,
      apiKeyPresent: Boolean(this.apiKey),
      workspaceRoot: this.context.workspaceRoot,
      v8Workspace: this.context.v8Workspace,
      v8
    };
  }

  route(task: string): unknown {
    return this.router.route(task);
  }

  async run(task: string): Promise<unknown> {
    this.state.transition("ROUTING");
    const route = this.router.route(task);

    this.state.transition("CALLING_MODEL");
    const prompt = this.builder.build(route.persona, task);
    const model = this.modelFor(route.persona);

    const raw = await new GeminiClient(this.apiKey, this.context.dryRun).generate(model, prompt);
    const parsed = this.parser.parse(raw, route.persona);

    this.state.transition("VALIDATING_TOOLS");
    const validation = this.security.validateToolRequests(route.persona, parsed.tool_requests);

    const toolResults: unknown[] = [];

    if (validation.ok) {
      this.state.transition("EXECUTING_TOOLS");

      for (const request of parsed.tool_requests) {
        toolResults.push(await this.tools.execute(request, this.context));
      }
    }

    this.state.transition("WRITING_EVIDENCE");
    await this.ledger.append({
      persona: route.persona,
      task,
      route_reason: route.reason,
      summary: parsed.summary,
      tool_requests: parsed.tool_requests,
      risk_score: validation.ok ? parsed.risk_score : 95,
      next_action: validation.ok ? parsed.next_action : `Security blocked: ${validation.errors.join("; ")}`,
      cost_estimate_usd: 0
    });

    this.state.transition(validation.ok ? "DONE" : "FAILED");

    return {
      route,
      model,
      response: parsed,
      tool_validation: validation,
      tool_results: toolResults,
      state: this.state.current()
    };
  }

  async evidence(): Promise<unknown> {
    return this.ledger.tail();
  }
}
