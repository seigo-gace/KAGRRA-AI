export class SecurityProbe {
  constructor() { this.name = "security_probe"; }

  async run(input) {
    const redFlags = ["--no-sandbox", "rm -rf", "curl | sh", "wget | sh", "sudo", "chmod -R", "git push --force"].filter((flag) => input.includes(flag));

    return {
      skill: this.name,
      ok: redFlags.length === 0,
      summary: redFlags.length ? "Security red flags detected." : "No immediate red flags detected.",
      data: { redFlags }
    };
  }
}
