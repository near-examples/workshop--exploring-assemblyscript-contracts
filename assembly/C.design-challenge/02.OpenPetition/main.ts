import { logging } from "near-sdk-as";

export function getName(): string {
  logging.log("This is the OpenPetition design challenge");
  return "OpenPetition Challenge";
}
