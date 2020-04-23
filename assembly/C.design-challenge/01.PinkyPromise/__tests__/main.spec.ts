import { getName } from '../main';

describe("PinkyPromise ", () => {
  it("should say challenge name", () => {
    expect(getName()).toBe("PinkyPromise Challenge");
  });
});

