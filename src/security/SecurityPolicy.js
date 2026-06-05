export class SecurityPolicy {
  validateToolRequests(persona, requests) {
    const errors = [];

    for (const req of requests) {
      if ((persona === "SONNET" || persona === "OPUS") && req.requires_write) {
        errors.push(`${persona} cannot request write tool: ${req.tool}`);
      }

      if (persona === "MYTHOS" && (req.requires_write || ["atomic_write", "rollback"].includes(req.tool))) {
        errors.push(`MYTHOS cannot mutate workspace: ${req.tool}`);
      }

      if (req.requires_write && persona !== "HAIKU") {
        errors.push(`Only HAIKU can request write tool: ${req.tool}`);
      }

      if (req.risk >= 80 && persona !== "HAIKU") {
        errors.push(`High-risk tool request must be handled by HAIKU with SONNET evidence review: ${req.tool}`);
      }
    }

    return { ok: errors.length === 0, errors };
  }
}
