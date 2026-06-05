export class ShadowWorkspace {
  constructor() {
    this.patches = [];
  }

  stagePatch(file, content) {
    const patch = { file, content, staged: true, mode: "shadow" };
    this.patches.push(patch);
    return patch;
  }

  list() {
    return [...this.patches];
  }

  clear() {
    this.patches = [];
  }
}
