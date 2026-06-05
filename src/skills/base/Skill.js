export class Skill {
  constructor(name) {
    this.name = name;
  }

  async run(_input, _context) {
    return {
      skill: this.name,
      ok: true,
      summary: "Base skill executed."
    };
  }
}
