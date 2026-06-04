import assert from "node:assert/strict";
import { Router } from "../src/core/Router.js";
import { SecurityPolicy } from "../src/security/SecurityPolicy.js";
import { ResponseParser } from "../src/adapter/ResponseParser.js";
import { MythosParallel } from "../src/parallel/MythosParallel.js";
import { V8Adapter } from "../src/v8/V8Adapter.js";

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

assert.equal(new MythosParallel().lanes().length, 16);

const parsedLog = new V8Adapter(".").parseBuildLog("FAILED test");
assert.equal(parsedLog.failed, true);

console.log("KAGRRA COMPLETE DEV PACKAGE v1 tests passed.");
