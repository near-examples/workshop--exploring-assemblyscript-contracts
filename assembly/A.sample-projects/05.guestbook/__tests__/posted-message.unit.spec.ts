import { PostedMessage } from "../assembly/model";
import { u128, VMContext } from "near-sdk-as";

function createMessage(text: string): PostedMessage {
  return new PostedMessage(text);
}

const alice = "alice";
const hello: string = "hello world";
let message: PostedMessage;

describe("05. Guestbook :: PostedMessage", () => {
  it("should allow instantiation", () => {
    message = createMessage(hello);
    expect(message instanceof PostedMessage).toBeTruthy();
  });

  it("should record sender automatically", () => {
    VMContext.setSigner_account_id(alice);

    message = createMessage(hello);
    expect(message.sender).toStrictEqual(alice);
  });

  it("should allow for premium messages", () => {
    VMContext.setSigner_account_id(alice);
    VMContext.setAttached_deposit(u128.from("10000000000000000000000"));

    message = createMessage(hello);
    expect(message.premium).toBeTruthy();
  });
});
