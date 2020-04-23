import { logging } from "near-sdk-as";

export function getName(): string {
  logging.log("This is the PinkyPromise design challenge");
  return "PinkyPromise Challenge";
}
