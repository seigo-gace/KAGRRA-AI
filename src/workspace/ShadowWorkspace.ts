export class ShadowWorkspace {
  stagePatch(file: string, content: string): { file: string; content: string; staged: boolean } {
    return { file, content, staged: true };
  }
}
