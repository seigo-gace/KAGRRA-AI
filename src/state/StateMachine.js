export class StateMachine {
  constructor() {
    this.state = "IDLE";
    this.history = ["IDLE"];
  }

  transition(next) {
    this.state = next;
    this.history.push(next);
    return this.state;
  }

  current() {
    return this.state;
  }

  timeline() {
    return [...this.history];
  }
}
