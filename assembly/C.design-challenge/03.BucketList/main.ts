import { logging } from "near-sdk-as";

export function getName(): string {
  logging.log("This is the BucketList design challenge");
  return "BucketList Challenge";
}
