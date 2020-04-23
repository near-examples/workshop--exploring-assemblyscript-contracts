import { getName } from '../main';

describe("OpenPetition ", () => {
  it("should say challenge name", () => {
    expect(getName()).toBe("OpenPetition Challenge");
  });
});

