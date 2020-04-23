import { getName } from '../main';

describe("BucketList ", () => {
  it("should say challenge name", () => {
    expect(getName()).toBe("BucketList Challenge");
  });
});

