import { context, logging, storage } from "near-sdk-as";

/**
 * This is a `view` function that returns transaction signer's account name
 * and appends to the log
 */
export function sayMyName(): string {
  logging.log("sayMyName() function was called");
  return "Hello, " + context.sender + "!";
}

/**
 * This is a `call` function that saves the transaction signer's account name
 * to storage and appends to the log
 */
export function saveMyName(): void {
  logging.log("saveMyName() function was called");
  storage.setString("sender", context.sender);
}
