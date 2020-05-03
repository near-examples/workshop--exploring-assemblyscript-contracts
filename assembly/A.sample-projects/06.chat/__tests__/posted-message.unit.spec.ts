import { PostedMessage } from "../models";

describe("06. Chat :: PostedMessage", () => {
  it("should allow instantiation", () => {
    const message = new PostedMessage(0, "alice", "hello, world", 0, "general");
    expect(message instanceof PostedMessage).toBeTruthy();
  });
});
