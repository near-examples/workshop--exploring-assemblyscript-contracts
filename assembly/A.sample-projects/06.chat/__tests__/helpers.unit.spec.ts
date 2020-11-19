import { getChannelCollectionName, getThreadCollectionName } from "../assembly/models";

describe("06. Chat :: Helpers", () => {
  it("should return the channel collection name", () => {
    expect(getChannelCollectionName("general")).toStrictEqual(
      "CHANNEL10:general"
    );
  });

  it("should return the thread collection name", () => {
    expect(getThreadCollectionName(0)).toStrictEqual("THREAD10:0");
  });
});
