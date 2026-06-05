import assert from "node:assert/strict";
import { Router } from "../src/core/Router.js";
import { SecurityPolicy } from "../src/security/SecurityPolicy.js";
import { ResponseParser } from "../src/adapter/ResponseParser.js";
import { MythosParallelExplorer } from "../src/skills/analysis/MythosParallelExplorer.js";
import { V8Adapter } from "../src/v8/V8Adapter.js";
import { SkillRegistry } from "../src/skills/SkillRegistry.js";
import { KagrraRuntime } from "../src/core/KagrraRuntime.js";

const router = new Router();

assert.equal(router.route("future architecture research").persona, "OPUS");
assert.equal(router.route("unknown crash security failure").persona, "MYTHOS");
assert.equal(router.route("patch and commit file").persona, "HAIKU");
assert.equal(router.route("summarize this").persona, "SONNET");

const security = new SecurityPolicy();

assert.equal(
  security.validateToolRequests("MYTHOS", [
    { tool: "atomic_write", reason: "bad", args: {}, risk: 90, requires_write: true }
  ]).ok,
  false
);

assert.equal(
  security.validateToolRequests("HAIKU", [
    { tool: "atomic_write", reason: "ok", args: {}, risk: 40, requires_write: true }
  ]).ok,
  true
);

const parsed = new ResponseParser().parse(JSON.stringify({
  persona: "SONNET",
  summary: "ok",
  tool_requests: [],
  evidence: ["test"],
  risk_score: 1,
  next_action: "done"
}), "SONNET");

assert.equal(parsed.persona, "SONNET");

const laneResult = await new MythosParallelExplorer().run("failure", {
  workspaceRoot: ".",
  v8Workspace: "workspaces/v8",
  dryRun: true
});
assert.equal(laneResult.data.lanes.length, 16);

const parsedLog = new V8Adapter(".").parseBuildLog("FAILED test");
assert.equal(parsedLog.failed, true);

const skills = new SkillRegistry().list();
assert.ok(skills.includes("intent_reader"));
assert.ok(skills.includes("mythos_parallel_explorer"));
assert.ok(skills.includes("atomic_writer"));
assert.ok(skills.length >= 20);

const runtime = new KagrraRuntime({
  workspaceRoot: process.cwd(),
  v8Workspace: "workspaces/v8",
  dryRun: true
}, undefined);

const result = await runtime.run("unknown V8 crash");
assert.equal(result.route.persona, "MYTHOS");
assert.equal(result.skill_results.length >= 5, true);

console.log("KAGRRA COMPLETE DEV PACKAGE v3 VERIFIED tests passed.");
