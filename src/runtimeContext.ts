import path from "node:path";
import { RuntimeContext } from "./types.js";

function boolEnv(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function createContext(): RuntimeContext {
  const workspaceRoot = path.resolve(process.env.KAGRRA_WORKSPACE_ROOT || process.cwd());
  const v8Workspace = path.resolve(workspaceRoot, process.env.KAGRRA_V8_WORKSPACE || "workspaces/v8");

  return {
    workspaceRoot,
    v8Workspace,
    dryRun: boolEnv(process.env.KAGRRA_DRY_RUN, !process.env.GEMINI_API_KEY)
  };
}
