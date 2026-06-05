import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

const required = [
  "README.md",
  "package.json",
  ".env.example",
  "src/cli.js",
  "src/core/KagrraRuntime.js",
  "src/core/Router.js",
  "src/skills/SkillRegistry.js",
  "config/skill.manifest.json",
  "prompts/personas/sonnet.md",
  "prompts/personas/opus.md",
  "prompts/personas/mythos.md",
  "prompts/personas/haiku.md",
  "docs/claude-data/CLAUDE_DATA_COMPATIBILITY.md"
];

for (const file of required) {
  const full = path.join(root, file);
  assert.equal(fs.existsSync(full), true, `missing file: ${file}`);
  const content = fs.readFileSync(full, "utf8");
  assert.ok(content.trim().length > 80, `file too thin: ${file}`);
}

const personaFiles = ["sonnet.md", "opus.md", "mythos.md", "haiku.md"];
for (const file of personaFiles) {
  const content = fs.readFileSync(path.join(root, "prompts/personas", file), "utf8");
  assert.ok(content.includes("Specialized Skill"), `persona missing specialized skill: ${file}`);
  assert.ok(content.split("\n").length >= 20, `persona file too short: ${file}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "config/skill.manifest.json"), "utf8"));
for (const persona of ["SONNET", "OPUS", "MYTHOS", "HAIKU"]) {
  assert.ok(manifest.persona_skill_binding[persona], `missing skill binding: ${persona}`);
  assert.ok(manifest.persona_skill_binding[persona].skills.length >= 5, `too few skills: ${persona}`);
}

const forbidden = ["TO" + "DO", "省" + "略", "後" + "ほど", "placeholder" + " only"];
const allFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (![".git", "node_modules"].includes(name)) walk(full);
    } else {
      allFiles.push(full);
    }
  }
}
walk(root);

for (const file of allFiles) {
  const rel = path.relative(root, file);
  if (rel.endsWith(".zip")) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const word of forbidden) {
    assert.equal(content.includes(word), false, `forbidden marker "${word}" in ${rel}`);
  }
}

console.log("KAGRRA package audit passed.");
