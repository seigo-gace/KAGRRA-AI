import { promises as fs } from "node:fs";
import path from "node:path";

export async function readText(file: string): Promise<string> {
  return fs.readFile(file, "utf8");
}

export async function writeText(file: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf8");
}

export async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readText(file)) as T;
}

export async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export function isInside(root: string, target: string): boolean {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(root, target);
  return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + path.sep);
}
