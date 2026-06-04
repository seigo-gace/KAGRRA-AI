export type RuntimeState =
  | "IDLE"
  | "ROUTING"
  | "CALLING_MODEL"
  | "VALIDATING_TOOLS"
  | "EXECUTING_TOOLS"
  | "WRITING_EVIDENCE"
  | "DONE"
  | "FAILED";

export class StateMachine {
  private state: RuntimeState = "IDLE";

  transition(next: RuntimeState): RuntimeState {
    this.state = next;
    return this.state;
  }

  current(): RuntimeState {
    return this.state;
  }
}
