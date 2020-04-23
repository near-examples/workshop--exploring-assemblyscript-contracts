import { getChannelCollectionName, getThreadCollectionName } from '../models';

describe("Chat :: Helpers", () => {
  it("should return the channel collection name", () => {
    expect(getChannelCollectionName("general")).toStrictEqual("CHANNEL10:general")
  })

  it("should return the thread collection name", () => {
    expect(getThreadCollectionName(0)).toStrictEqual("THREAD10:0")
  })
})