import { context, logging, storage } from "near-sdk-as";

export function sayMyName(): string {
  logging.log("sayMyName() function was called");
  return "Hello, " + context.sender + "!";
}

export function saveMyName(): void {
  logging.log("saveMyName() function was called");
  storage.setString("sender", context.sender);
}
