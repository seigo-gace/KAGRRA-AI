import fs from "node:fs/promises";
import path from "node:path";

export async function readText(file) {
  return fs.readFile(file, "utf8");
}

export async function writeText(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf8");
}

export async function readJson(file) {
  return JSON.parse(await readText(file));
}

export async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export function isInside(root, target) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(root, target);
  return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + path.sep);
}
