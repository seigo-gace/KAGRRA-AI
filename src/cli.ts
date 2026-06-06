#!/usr/bin/env node
import { KagrraRuntime } from "./core/KagrraRuntime.js";
import { createContext } from "./runtimeContext.js";
import { startDashboard } from "./dashboard/server.js";

function runtime(): KagrraRuntime {
  return new KagrraRuntime(createContext(), process.env.GEMINI_API_KEY);
}

function printHelp(): void {
  console.log(`Usage: kagrra <command> [task...]

Commands:
  doctor        Show runtime health and workspace diagnostics
  route         Route the given task
  run           Execute the given task
  evidence      Print the evidence ledger tail
  dashboard     Start the local dashboard
  help          Show this help text
`);
}

const [cmd, ...rest] = process.argv.slice(2);

try {
  if (!cmd || cmd === "doctor") {
    console.log(JSON.stringify(await runtime().doctor(), null, 2));
  } else if (cmd === "route") {
    console.log(JSON.stringify(runtime().route(rest.join(" ")), null, 2));
  } else if (cmd === "run") {
    console.log(JSON.stringify(await runtime().run(rest.join(" ")), null, 2));
  } else if (cmd === "evidence") {
    console.log(JSON.stringify(await runtime().evidence(), null, 2));
  } else if (cmd === "dashboard") {
    const port = Number(process.env.KAGRRA_DASHBOARD_PORT || 8787);
    await startDashboard(port);
  } else if (cmd === "help" || cmd === "--help" || cmd === "-h") {
    printHelp();
  } else {
    console.error(`Unknown command: ${cmd}`);
    printHelp();
    process.exit(1);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}
