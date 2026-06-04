#!/usr/bin/env node
import { Command } from "commander";
import { KagrraRuntime } from "./core/KagrraRuntime.js";
import { createContext } from "./runtimeContext.js";
import { startDashboard } from "./dashboard/server.js";

const program = new Command();

function runtime(): KagrraRuntime {
  return new KagrraRuntime(createContext(), process.env.GEMINI_API_KEY);
}

program.name("kagrra").version("1.0.0");

program.command("doctor").action(async () => {
  console.log(JSON.stringify(await runtime().doctor(), null, 2));
});

program.command("route").argument("<task...>").action((task: string[]) => {
  console.log(JSON.stringify(runtime().route(task.join(" ")), null, 2));
});

program.command("run").argument("<task...>").action(async (task: string[]) => {
  console.log(JSON.stringify(await runtime().run(task.join(" ")), null, 2));
});

program.command("evidence").action(async () => {
  console.log(JSON.stringify(await runtime().evidence(), null, 2));
});

program.command("dashboard").action(async () => {
  const port = Number(process.env.KAGRRA_DASHBOARD_PORT || 8787);
  await startDashboard(port);
});

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
  process.exit(1);
});
